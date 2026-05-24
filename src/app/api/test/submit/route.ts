import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Question from "@/models/Question";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/auth";
import { sendTestPassedEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json(); // Array of { questionId, selectedOption }
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let score = 0;
    const totalQuestions = answers.length;

    for (const ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (q && q.answer === ans.selectedOption) {
        score++;
      }
    }

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= 30; // 30% passing threshold

    user.testStatus = passed ? "passed" : "failed";
    await user.save();

    // Refresh JWT with updated status
    const newToken = generateToken(user._id.toString(), user.testStatus, user.paymentStatus);
    const cookieStoreRefresh = await cookies();
    cookieStoreRefresh.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Send congratulations email if passed
    if (passed) {
      try {
        const requestUrl = new URL(req.url);
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
        await sendTestPassedEmail(user.email, user.name, baseUrl);
      } catch (emailErr) {
        console.error("Failed to send congratulations email:", emailErr);
      }
    }

    return NextResponse.json({ score, total: totalQuestions, percentage, status: user.testStatus });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
