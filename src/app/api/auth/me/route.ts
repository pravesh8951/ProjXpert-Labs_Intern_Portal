import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import UserCourseProgress from "@/models/UserCourseProgress";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id).select(
      "name email role testStatus paymentStatus domain xp level streak badges currentDay assignmentsCompleted quizAccuracy internshipPlan unlockedDays completedDays completedReadings completedQuizzes dailyQuizScores totalProgress lastActiveDate createdAt"
    );
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let progressDoc = await UserCourseProgress.findOne({ userId: user._id });

    if (!progressDoc && user.paymentStatus === "completed") {
      // Auto-initialize for existing users
      const plan = user.internshipPlan || "1m";
      const totalDays = plan === "3m" ? 90 : plan === "2m" ? 60 : 30;
      
      const quizProgress = Array.from({ length: totalDays }).map((_, i) => ({
        day: i + 1,
        completed: user.completedQuizzes?.includes(i + 1) || false,
        score: 0,
        totalMarks: 0,
        percentage: 0
      }));

      if (user.dailyQuizScores) {
        user.dailyQuizScores.forEach(oldScore => {
          const qObj = quizProgress.find(q => q.day === oldScore.day);
          if (qObj) {
            qObj.score = oldScore.score;
            qObj.totalMarks = oldScore.total;
            qObj.percentage = oldScore.total > 0 ? Math.round((oldScore.score / oldScore.total) * 100) : 0;
            qObj.completed = oldScore.passed;
          }
        });
      }

      const readingProgress = Array.from({ length: totalDays }).map((_, i) => ({
        day: i + 1,
        completed: user.completedReadings?.includes(i + 1) || false
      }));

      progressDoc = new UserCourseProgress({
        userId: user._id,
        courseId: null,
        subscriptionPlan: plan,
        totalDays,
        xp: user.xp || 0,
        level: user.level || 1,
        streak: user.streak || 1,
        completedDays: user.completedDays || [],
        unlockedDays: user.unlockedDays || [1],
        quizProgress,
        readingProgress
      });
      await progressDoc.save();
    }

    // Map quizProgress to dailyQuizScores format for frontend compatibility
    let mappedQuizScores = user.dailyQuizScores ?? [];
    let completedReadings = user.completedReadings ?? [];
    let completedQuizzes = user.completedQuizzes ?? [];

    if (progressDoc) {
      mappedQuizScores = progressDoc.quizProgress.filter(q => q.totalMarks > 0 || q.completed).map(q => ({
        day: q.day,
        score: q.score,
        total: q.totalMarks,
        passed: q.completed,
        completedAt: q.submittedAt || new Date()
      }));
      completedReadings = progressDoc.readingProgress.filter(r => r.completed).map(r => r.day);
      completedQuizzes = progressDoc.quizProgress.filter(q => q.completed).map(q => q.day);

      // Self-heal: ensure every completed day's successor is unlocked (fixes stale docs)
      let needsSave = false;
      for (const completedDay of progressDoc.completedDays) {
        const nextDay = completedDay + 1;
        if (!progressDoc.unlockedDays.includes(nextDay)) {
          progressDoc.unlockedDays.push(nextDay);
          needsSave = true;
        }
      }
      // Always ensure day 1 is unlocked
      if (!progressDoc.unlockedDays.includes(1)) {
        progressDoc.unlockedDays.push(1);
        needsSave = true;
      }
      if (needsSave) await progressDoc.save();
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        testStatus: user.testStatus,
        paymentStatus: user.paymentStatus,
        domain: user.domain,
        internshipPlan: user.internshipPlan,
        badges: user.badges,
        assignmentsCompleted: user.assignmentsCompleted,
        quizAccuracy: user.quizAccuracy,
        totalProgress: user.totalProgress ?? 0,
        createdAt: user.createdAt,

        // currentDay: derived from completed days so it's always accurate
        currentDay: progressDoc
          ? (progressDoc.completedDays.length > 0
              ? Math.max(...progressDoc.completedDays) + 1
              : 1)
          : (user.currentDay ?? 1),

        // Progression fields (Overridden by UserCourseProgress if exists)
        xp: progressDoc ? progressDoc.xp : user.xp,
        level: progressDoc ? progressDoc.level : user.level,
        streak: progressDoc ? progressDoc.streak : user.streak,
        unlockedDays: progressDoc ? progressDoc.unlockedDays : (user.unlockedDays ?? [1]),
        completedDays: progressDoc ? progressDoc.completedDays : (user.completedDays ?? []),
        completedReadings: completedReadings,
        completedQuizzes: completedQuizzes,
        dailyQuizScores: mappedQuizScores,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
