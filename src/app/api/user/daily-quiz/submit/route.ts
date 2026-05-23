import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    
    const body = await req.json();
    const { day, score, total, passed } = body;

    if (day === undefined || score === undefined || total === undefined || passed === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if score for this day already exists
    const existingScoreIndex = user.dailyQuizScores?.findIndex((q: any) => q.day === day);
    
    if (existingScoreIndex !== undefined && existingScoreIndex >= 0) {
      // Update existing attempt (if they try again)
      user.dailyQuizScores[existingScoreIndex] = {
        day,
        score,
        total,
        passed,
        completedAt: new Date()
      };
    } else {
      // Add new attempt
      if (!user.dailyQuizScores) user.dailyQuizScores = [];
      user.dailyQuizScores.push({
        day,
        score,
        total,
        passed,
        completedAt: new Date()
      });
      
      // If passed for the first time, award XP
      if (passed) {
        user.xp += 30;
      }
    }

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
