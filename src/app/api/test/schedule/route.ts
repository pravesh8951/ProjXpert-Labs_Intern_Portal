import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendScheduleTestEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { scheduledDate } = await req.json();
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.scheduledTestDate = new Date(scheduledDate);
    await user.save();

    const requestUrl = new URL(req.url);
    const origin = `${requestUrl.protocol}//${requestUrl.host}`;
    const testUrl = `${origin}/test?start=true`;
    const formattedDate = new Date(scheduledDate).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    await sendScheduleTestEmail(user.email, user.name, formattedDate, testUrl);

    return NextResponse.json({ message: "Test scheduled and email sent!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
