import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import mongoose from "mongoose";
import { uploadFileToDrive, deleteFileFromDrive } from "@/lib/googleDrive";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip"];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

const ASSIGNMENT_QUESTION_IDS: Record<string, string> = {
  cybersecurity: "6a12d4394ac1a5d6b5d3e6d9",
  ai: "6a12d51b4ac1a5d6b5d3e6da",
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id).select(
      "name domain completedReadings completedQuizzes assignmentsCompleted createdAt"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assignmentWeekStr = formData.get("assignmentWeek") as string | null;

    if (!file || !assignmentWeekStr) {
      return NextResponse.json(
        { error: "Missing file or assignmentWeek" },
        { status: 400 }
      );
    }

    const assignmentWeek = parseInt(assignmentWeekStr, 10);
    if (isNaN(assignmentWeek) || assignmentWeek < 1 || assignmentWeek > 12) {
      return NextResponse.json(
        { error: "Invalid assignment week (must be 1–12)" },
        { status: 400 }
      );
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      userId: user._id,
      assignmentWeek,
    });

    // Validate file extension
    const fileName = file.name;
    const ext = "." + fileName.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      // Some browsers may not send MIME type — fall back to extension check above
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 15 MB limit" },
        { status: 400 }
      );
    }

    // Verify assignment is unlocked
    const startDay = (assignmentWeek - 1) * 5 + 1;
    const endDay = assignmentWeek * 5;
    const requiredDays = Array.from(
      { length: endDay - startDay + 1 },
      (_, i) => startDay + i
    );
    // Fetch progress from UserCourseProgress model
    const UserCourseProgress = mongoose.models.UserCourseProgress || mongoose.model("UserCourseProgress", new mongoose.Schema({}, { strict: false }));
    const progressDoc = await UserCourseProgress.findOne({ userId: user._id });

    const completedReadings: number[] = progressDoc 
      ? progressDoc.readingProgress?.filter((r: any) => r.completed).map((r: any) => r.day) || []
      : user.completedReadings || [];
      
    const completedQuizzes: number[] = progressDoc
      ? progressDoc.quizProgress?.filter((q: any) => q.completed).map((q: any) => q.day) || []
      : user.completedQuizzes || [];

    const allReadingsDone = requiredDays.every((d) => completedReadings.includes(d));
    const allQuizzesDone = requiredDays.every((d) => completedQuizzes.includes(d));

    if (!allReadingsDone || !allQuizzesDone) {
      return NextResponse.json(
        { error: `Complete Days ${startDay}–${endDay} reading & quiz to unlock this assignment.` },
        { status: 403 }
      );
    }

    // Verify deadline hasn't passed
    const userCreatedAt = new Date(user.createdAt);
    const unlockDate = new Date(userCreatedAt);
    unlockDate.setDate(unlockDate.getDate() + endDay);
    const deadline = new Date(unlockDate);
    deadline.setDate(deadline.getDate() + 10);

    if (new Date() > deadline) {
      return NextResponse.json(
        { error: "Submission deadline has passed." },
        { status: 403 }
      );
    }

    // Get assignment title from MongoDB
    const domain = user.domain || "cybersecurity";
    let assignmentTitle = `Week ${assignmentWeek} Assignment`;
    const questionOid = ASSIGNMENT_QUESTION_IDS[domain];
    if (questionOid) {
      const db = mongoose.connection.db;
      if (db) {
        const doc = await db.collection("assignmentquestions").findOne({
          _id: new mongoose.Types.ObjectId(questionOid),
        });
        if (doc?.assignments) {
          const q = doc.assignments.find((a: any) => a.week === assignmentWeek);
          if (q) assignmentTitle = q.assignmentTitle;
        }
      }
    }

    // Upload to Google Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const { fileId, webViewLink } = await uploadFileToDrive(
      domain,
      user.name,
      user._id.toString(),
      assignmentWeek,
      fileName,
      file.type || "application/octet-stream",
      buffer
    );

    // If it's a replacement, delete the old file from Google Drive
    if (existingSubmission && existingSubmission.driveFileId) {
      await deleteFileFromDrive(existingSubmission.driveFileId);
    }

    // Save submission to MongoDB
    let submission;
    if (existingSubmission) {
      submission = await AssignmentSubmission.findOneAndUpdate(
        { _id: existingSubmission._id },
        {
          $set: {
            driveFileId: fileId,
            driveLink: webViewLink,
            fileName,
            fileSize: file.size,
            submittedAt: new Date(),
            status: "submitted",
          },
        },
        { new: true }
      );
    } else {
      submission = await AssignmentSubmission.create({
        userId: user._id,
        userName: user.name,
        courseDomain: domain,
        assignmentWeek,
        assignmentTitle,
        driveFileId: fileId,
        driveLink: webViewLink,
        fileName,
        fileSize: file.size,
        submittedAt: new Date(),
        deadline,
        status: "submitted",
      });
    }

    if (!submission) {
      throw new Error("Failed to save or update submission");
    }

    // Increment user's assignmentsCompleted only if it's a first-time submission
    if (!existingSubmission) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { assignmentsCompleted: 1 },
      });
    }

    return NextResponse.json({
      success: true,
      submission: {
        fileName: submission.fileName,
        fileSize: submission.fileSize,
        submittedAt: submission.submittedAt,
        driveLink: submission.driveLink,
      },
    });
  } catch (error: any) {
    console.error("POST /api/assignments/upload error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
