import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import mongoose from "mongoose";

// Assignment question data OIDs
const ASSIGNMENT_QUESTION_IDS: Record<string, string> = {
  cybersecurity: "6a12d4394ac1a5d6b5d3e6d9",
  ai: "6a12d51b4ac1a5d6b5d3e6da",
};

export async function GET() {
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

    const domain = user.domain || "cybersecurity";
    const questionOid = ASSIGNMENT_QUESTION_IDS[domain];

    // Fetch assignment questions from MongoDB
    let assignmentQuestions: { week: number; assignmentTitle: string; task: string }[] = [];
    if (questionOid) {
      const db = mongoose.connection.db;
      if (db) {
        const doc = await db.collection("assignmentquestions").findOne({
          _id: new mongoose.Types.ObjectId(questionOid),
        });
        if (doc && doc.assignments) {
          assignmentQuestions = doc.assignments;
        }
      }
    }

    // Fetch all submissions for this user
    const submissions = await AssignmentSubmission.find({ userId: user._id });
    const submissionMap = new Map(
      submissions.map((s) => [s.assignmentWeek, s])
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
      
    const userCreatedAt = new Date(user.createdAt);

    // Build 12 assignment objects
    const assignments = [];
    for (let week = 1; week <= 12; week++) {
      // Days required for this assignment: (week-1)*5 + 1 through week*5
      const startDay = (week - 1) * 5 + 1;
      const endDay = week * 5;
      const requiredDays = Array.from(
        { length: endDay - startDay + 1 },
        (_, i) => startDay + i
      );

      // Check if all required days have reading + quiz completed
      const allReadingsDone = requiredDays.every((d) =>
        completedReadings.includes(d)
      );
      const allQuizzesDone = requiredDays.every((d) =>
        completedQuizzes.includes(d)
      );
      const isUnlocked = allReadingsDone && allQuizzesDone;

      // Get the question data for this week
      const questionData = assignmentQuestions.find((q) => q.week === week);

      // Deadline: 10 days from when assignment unlocks
      // unlockDate = user.createdAt + (endDay - 1) days (the day the last of the 5 days would be completed)
      // But we use actual completion — if unlocked, deadline is 10 days from now or from createdAt + endDay
      const unlockDate = new Date(userCreatedAt);
      unlockDate.setDate(unlockDate.getDate() + endDay); // after the 5 days are done
      const deadline = new Date(unlockDate);
      deadline.setDate(deadline.getDate() + 10); // + 10 day window

      const submission = submissionMap.get(week);
      const now = new Date();

      let status: "locked" | "unlocked" | "submitted" | "deadline_passed";
      if (submission) {
        status = "submitted";
      } else if (!isUnlocked) {
        status = "locked";
      } else if (now > deadline) {
        status = "deadline_passed";
      } else {
        status = "unlocked";
      }

      const daysRemaining =
        status === "unlocked"
          ? Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 86400000))
          : null;

      assignments.push({
        week,
        title: questionData?.assignmentTitle || `Week ${week} Assignment`,
        task: questionData?.task || "",
        requiredDays: `Day ${startDay}–${endDay}`,
        status,
        deadline: deadline.toISOString(),
        daysRemaining,
        submission: submission
          ? {
              fileName: submission.fileName,
              fileSize: submission.fileSize,
              submittedAt: submission.submittedAt,
              driveLink: submission.driveLink,
              adminStatus: submission.status,
              adminRemarks: submission.adminRemarks,
            }
          : null,
      });
    }

    return NextResponse.json({
      assignments,
      stats: {
        total: 12,
        submitted: submissions.length,
        pending: 12 - submissions.length,
      },
    });
  } catch (error: any) {
    console.error("GET /api/assignments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
