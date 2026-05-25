import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const dayStr = searchParams.get("day");

    if (!domain || !dayStr) {
      return NextResponse.json({ error: "Missing domain or day" }, { status: 400 });
    }

    const day = parseInt(dayStr, 10);
    if (isNaN(day) || day < 1) {
      return NextResponse.json({ error: "Invalid day" }, { status: 400 });
    }

    await connectToDatabase();

    // Use MongoDB aggregation to extract only the specific day's content
    // This avoids fetching the entire massive course document
    const result = await Course.aggregate([
      { $match: { domain } },
      { $unwind: "$months" },
      { $unwind: "$months.weeks" },
      { $unwind: "$months.weeks.days" },
      { $match: { "months.weeks.days.day": day } },
      {
        $project: {
          _id: 0,
          day: "$months.weeks.days.day",
          weekday: "$months.weeks.days.weekday",
          title: "$months.weeks.days.title",
          topics: "$months.weeks.days.topics",
          content: "$months.weeks.days.content",
          week: "$months.weeks.week",
          weekTitle: "$months.weeks.title",
        },
      },
    ]);

    if (result.length === 0) {
      return NextResponse.json({ error: "Day content not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Fetch day content error:", error);
    return NextResponse.json({ error: "Failed to fetch day content" }, { status: 500 });
  }
}
