import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (will overwrite or create new)
    // Wait, it's better to just delete existing OTPs for this email to avoid spam
    await OTP.deleteMany({ email });
    
    await OTP.create({
      email,
      otp: otpCode,
    });

    // Send OTP via email
    await sendOTP(email, otpCode);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
