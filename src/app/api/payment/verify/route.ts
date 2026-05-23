import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/auth";

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
