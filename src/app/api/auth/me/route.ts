import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
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

    const user = await User.findById(decoded.id).select("name email role testStatus paymentStatus domain xp level streak badges currentDay assignmentsCompleted quizAccuracy internshipPlan");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
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
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        currentDay: user.currentDay,
        assignmentsCompleted: user.assignmentsCompleted,
        quizAccuracy: user.quizAccuracy,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
