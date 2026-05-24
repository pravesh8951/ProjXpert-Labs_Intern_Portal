import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const admin = await User.findById(decoded.id).select("role");
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query params for filtering
    const { searchParams } = req.nextUrl;
    const domainFilter = searchParams.get("domain");
    const weekFilter = searchParams.get("week");
    const userFilter = searchParams.get("userId");

    const query: any = {};
    if (domainFilter) query.courseDomain = domainFilter;
    if (weekFilter) query.assignmentWeek = parseInt(weekFilter, 10);
    if (userFilter) query.userId = userFilter;

    const submissions = await AssignmentSubmission.find(query)
      .sort({ submittedAt: -1 })
      .limit(200);

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error("GET /api/admin/assignments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const admin = await User.findById(decoded.id).select("role");
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { submissionId, status, adminRemarks } = body;

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: "Missing submissionId or status" },
        { status: 400 }
      );
    }

    const validStatuses = ["reviewed", "approved", "needs_changes"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      {
        status,
        ...(adminRemarks !== undefined && { adminRemarks }),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/assignments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
