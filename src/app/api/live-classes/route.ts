import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import LiveClass from "@/models/LiveClass";

const CYBER_ID = "6a12afdd4ac1a5d6b5d3e6c3";
const AI_ID = "6a12b1384ac1a5d6b5d3e6cc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const day = parseInt(searchParams.get("day") || "1", 10);

    if (!domain) {
      return NextResponse.json({ message: "Domain required" }, { status: 400 });
    }

    const docId = domain === "cybersecurity" ? CYBER_ID : (domain === "ai" ? AI_ID : null);
    
    if (!docId) {
      return NextResponse.json({ message: "Invalid domain" }, { status: 400 });
    }

    await connectToDatabase();

    const liveDoc = await LiveClass.findById(docId);

    if (!liveDoc) {
      return NextResponse.json({ message: "No classes found for this domain" }, { status: 404 });
    }

    const classData = liveDoc.days.find((c: any) => c.day === day);

    if (!classData) {
      return NextResponse.json({ message: "No class found for this day" }, { status: 404 });
    }

    return NextResponse.json(classData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
