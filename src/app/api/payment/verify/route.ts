import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import UserCourseProgress from "@/models/UserCourseProgress";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/auth";
import { sendPaymentSuccessEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      await connectToDatabase();
      const payment = await Payment.findOne({ orderId: razorpay_order_id });
      if (payment) {
        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;
        await payment.save();

        const user = await User.findById(decoded.id);
        if (user) {
          user.paymentStatus = "completed";
          user.dashboardActive = true;
          user.internshipPlan = payment.plan;
          await user.save();

          // Initialize UserCourseProgress document
          const totalDays = payment.plan === "3m" ? 90 : payment.plan === "2m" ? 60 : 30;
          
          let progressDoc = await UserCourseProgress.findOne({ userId: user._id });
          if (!progressDoc) {
            const quizProgress = Array.from({ length: totalDays }).map((_, i) => ({
              day: i + 1,
              completed: false,
              score: 0,
              totalMarks: 0,
              percentage: 0
            }));

            const readingProgress = Array.from({ length: totalDays }).map((_, i) => ({
              day: i + 1,
              completed: false
            }));

            progressDoc = new UserCourseProgress({
              userId: user._id,
              courseId: null, // Since this uses domain based architecture currently
              subscriptionPlan: payment.plan,
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

          // Refresh token with new paymentStatus AND preserve domain
          const newToken = generateToken(user._id.toString(), user.testStatus, user.paymentStatus, false, user.domain);
          const cookieStoreRefresh = await cookies();
          cookieStoreRefresh.set("auth_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
          });

          try {
            const requestUrl = new URL(req.url);
            const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
            await sendPaymentSuccessEmail(user.email, user.name, payment.plan, user.domain || 'ai', razorpay_payment_id, baseUrl);
          } catch (emailErr) {
            console.error("Failed to send payment success email:", emailErr);
          }
        }
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
