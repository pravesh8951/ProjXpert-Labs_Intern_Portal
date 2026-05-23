import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default arrays if missing
    const unlockedDays = user.unlockedDays || [1];
    const completedDays = user.completedDays || [];
    const completedReadings = user.completedReadings || [];
    const completedQuizzes = user.completedQuizzes || [];

    return NextResponse.json({
      xp: user.xp || 0,
      streak: user.streak || 1,
      unlockedDays,
      completedDays,
      completedReadings,
      completedQuizzes,
      currentDay: user.currentDay || 1,
      quizAccuracy: user.quizAccuracy || 0,
      totalProgress: user.totalProgress || 0,
      dailyQuizScores: user.dailyQuizScores || [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
