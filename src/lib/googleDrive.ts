import { google } from "googleapis";
import { Readable } from "stream";

function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
}

/**
 * Find a folder by name under a given parent. Returns the folder ID or null.
 */
async function findFolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  folderName: string
): Promise<string | null> {
  const res = await drive.files.list({
    q: `'${parentId}' in parents AND name='${folderName}' AND mimeType='application/vnd.google-apps.folder' AND trashed=false`,
    fields: "files(id, name)",
    spaces: "drive",
  });
  return res.data.files?.[0]?.id || null;
}

/**
 * Create a folder under a parent. Returns the new folder ID.
 */
async function createFolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  folderName: string
): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  return res.data.id!;
}

/**
 * Get or create a folder (idempotent).
 */
async function getOrCreateFolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  folderName: string
): Promise<string> {
  const existing = await findFolder(drive, parentId, folderName);
  if (existing) return existing;
  return createFolder(drive, parentId, folderName);
}



/**
 * Upload a file buffer to Google Drive under the specified parent folder.
 * Returns { fileId, webViewLink }.
 */
export async function uploadFileToDrive(
  domain: string,
  userName: string,
  userId: string,
  assignmentWeek: number,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ fileId: string; webViewLink: string }> {
  const drive = getDriveClient();

  // 1. Root folder is directly fetched from environment variable
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID environment variable is missing.");
  }

  // 2. Get or create domain folder (AI_ASSIGNMENTS or CYBERSECURITY_ASSIGNMENTS)
  const domainFolderName = `${domain.toUpperCase()}_ASSIGNMENTS`;
  const domainFolderId = await getOrCreateFolder(drive, rootFolderId, domainFolderName);

  // 3. Get or create student folder (USERNAME_USERID)
  const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, "_");
  const studentFolderName = `${sanitizedName}_${userId}`;
  const studentFolderId = await getOrCreateFolder(drive, domainFolderId, studentFolderName);

  // 4. Get or create assignment folder (Assignment_N)
  const assignmentFolderName = `Assignment_${assignmentWeek}`;
  const assignmentFolderId = await getOrCreateFolder(drive, studentFolderId, assignmentFolderName);

  // 5. Upload file
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const fileRes = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [assignmentFolderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  const fileId = fileRes.data.id!;

  // 6. Make file readable by anyone with the link
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Get updated webViewLink
  const updatedFile = await drive.files.get({
    fileId,
    fields: "webViewLink",
  });

  return {
    fileId,
    webViewLink: updatedFile.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
  };
}

/**
 * Delete a file from Google Drive by its file ID.
 */
export async function deleteFileFromDrive(fileId: string): Promise<void> {
  try {
    const drive = getDriveClient();
    await drive.files.delete({ fileId });
  } catch (error) {
    const err = error as Error;
    console.error(`Failed to delete file from drive: ${fileId}`, err.message);
  }
}
