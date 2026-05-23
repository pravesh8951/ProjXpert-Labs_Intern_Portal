import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, phone, college, password, otp } = await req.json();

    if (!name || !email || !phone || !college || !password || !otp) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create User
    await User.create({
      name,
      email,
      phone,
      college,
      passwordHash: hashedPassword,
      isVerified: true,
    });

    // Delete OTP
    await OTP.deleteOne({ _id: validOtp._id });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
