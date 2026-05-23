import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    await connectToDatabase();
    
    // Using mongoose to access the raw db connection to get courses
    const mongoose = require("mongoose");
    const db = mongoose.connection.db;

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const day = parseInt(searchParams.get("day") || "1", 10);

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });

    if (!course || !course.dailyQuizzes) {
      return NextResponse.json({ questions: [] });
    }

    const dailyQuiz = course.dailyQuizzes.find((q: any) => q.day === day);

    if (!dailyQuiz || !dailyQuiz.questions) {
      return NextResponse.json({ questions: [] });
    }

    return NextResponse.json({ questions: dailyQuiz.questions, title: dailyQuiz.title });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
