import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." }, { status: 200 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token and set to user
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = new Date(resetPasswordExpire);
    await user.save();

    // Create reset URL
    const requestUrl = new URL(req.url);
    const origin = `${requestUrl.protocol}//${requestUrl.host}`;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, resetUrl);
      return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." }, { status: 200 });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();
      return NextResponse.json({ error: "Email could not be sent" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
