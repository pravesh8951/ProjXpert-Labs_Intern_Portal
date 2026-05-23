import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    if (!["ai", "cybersecurity"].includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.domain = domain;
    await user.save();

    // Refresh JWT with domain
    const newToken = generateToken(user._id.toString(), user.testStatus, user.paymentStatus, false, domain);
    cookieStore.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
