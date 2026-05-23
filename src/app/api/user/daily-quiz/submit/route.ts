import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import UserCourseProgress from "@/models/UserCourseProgress";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    
    const body = await req.json();
    const { day, score, total, passed, percentage } = body;

    if (day === undefined || score === undefined || total === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let progressDoc = await UserCourseProgress.findOne({ userId: user._id });
    if (!progressDoc) {
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

    // Check if day is unlocked
    if (!progressDoc.unlockedDays.includes(day)) {
      return NextResponse.json({ error: "This day is locked." }, { status: 403 });
    }

    const isPassed = passed !== undefined ? passed : (score / total) >= 0.6;
    const calcPercentage = percentage || (total > 0 ? Math.round((score / total) * 100) : 0);

    // Find the quiz object in the array
    const quizIndex = progressDoc.quizProgress.findIndex(q => q.day === day);
    if (quizIndex === -1) {
      return NextResponse.json({ error: "Quiz day not found in progress document." }, { status: 404 });
    }

    // Update the quiz object
    progressDoc.quizProgress[quizIndex].score = score;
    progressDoc.quizProgress[quizIndex].totalMarks = total;
    progressDoc.quizProgress[quizIndex].percentage = calcPercentage;
    progressDoc.quizProgress[quizIndex].submittedAt = new Date();
    
    let xpEarned = 0;

    // Only award XP and unlock if this is the first time passing
    if (!progressDoc.quizProgress[quizIndex].completed && isPassed) {
      progressDoc.quizProgress[quizIndex].completed = true;
      progressDoc.xp += 30;
      xpEarned += 30;

      // Check if BOTH reading and quiz are done for this day to unlock the next day
      const readingObj = progressDoc.readingProgress.find(r => r.day === day);
      const isReadingDone = readingObj ? readingObj.completed : false;

      if (isReadingDone && !progressDoc.completedDays.includes(day)) {
        progressDoc.completedDays.push(day);

        // Update streak using lastActiveDate stored on the progress doc
        const now = new Date();
        if (!progressDoc.lastActiveDate) {
          progressDoc.streak = 1;
        } else {
          const prevDate = new Date(progressDoc.lastActiveDate);
          // Count calendar days between dates (not just 48h window)
          const prevDay = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const diffDays = Math.round((today.getTime() - prevDay.getTime()) / 86400000);
          if (diffDays <= 1) {
            // Same day or consecutive day — increment streak
            if (diffDays === 1) progressDoc.streak += 1;
            // diffDays === 0 means same day completion, keep streak as is
          } else {
            progressDoc.streak = 1; // Reset if more than 1 day gap
          }
        }
        progressDoc.lastActiveDate = new Date();

        // Advance currentDay on the User model so the dashboard shows next day
        const nextDay = day + 1;
        if (!user.currentDay || user.currentDay <= day) {
          user.currentDay = nextDay;
        }
        await user.save();

        // Unlock next day
        if (!progressDoc.unlockedDays.includes(nextDay)) {
          progressDoc.unlockedDays.push(nextDay);
        }
      }
    }

    // Update Level based on new XP (200 XP per level)
    progressDoc.level = Math.floor(progressDoc.xp / 200) + 1;

    await progressDoc.save();

    // To keep existing frontend functionality before fully migrating, we also send back the old structure fields by calculating them from progressDoc
    const completedQuizzes = progressDoc.quizProgress.filter(q => q.completed).map(q => q.day);
    const currentDay = progressDoc.completedDays.length > 0
      ? Math.max(...progressDoc.completedDays) + 1
      : 1;

    return NextResponse.json({
      message: "Quiz submitted successfully",
      xpEarned,
      newTotalXp: progressDoc.xp,
      completedQuizzes: completedQuizzes,
      unlockedDays: progressDoc.unlockedDays,
      completedDays: progressDoc.completedDays,
      streak: progressDoc.streak,
      currentDay,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
