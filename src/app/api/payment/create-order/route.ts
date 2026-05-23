import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, amount } = body;

    // Validate amount is a positive number
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();

    const options = {
      amount: numericAmount * 100, // Amount in paise (e.g. 999 → 99900)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: decoded.id,
      orderId: order.id,
      amount: numericAmount,
      plan: plan,
      status: "created",
    });

    return NextResponse.json({ orderId: order.id, amount: options.amount });
  } catch (error: any) {
    console.error("create-order error:", error);
    return NextResponse.json({ error: "Internal server error", detail: error?.message }, { status: 500 });
  }
}
