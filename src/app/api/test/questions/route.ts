import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Question from "@/models/Question";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// 20 easy, basic computer literacy questions
const easyQuestions = [
  { question: "What does 'www' stand for in a website URL?", options: ["World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"], answer: 0, category: "aptitude" },
  { question: "Which of the following is an example of an Operating System?", options: ["Google Chrome", "Microsoft Word", "Windows 11", "VLC Player"], answer: 2, category: "aptitude" },
  { question: "What does 'CPU' stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Control Processing Unit"], answer: 1, category: "aptitude" },
  { question: "Which company made the iPhone?", options: ["Samsung", "Google", "Apple", "Microsoft"], answer: 2, category: "aptitude" },
  { question: "What is the full form of 'Wi-Fi'?", options: ["Wireless Fidelity", "Wired Fidelity", "Wide Fidelity", "Wireless Frequency"], answer: 0, category: "aptitude" },
  { question: "Which of these is used to browse the internet?", options: ["Notepad", "Calculator", "Google Chrome", "Paint"], answer: 2, category: "aptitude" },
  { question: "What does 'AI' stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Applied Intelligence", "Adaptive Intelligence"], answer: 1, category: "ai" },
  { question: "What is an example of a social media platform?", options: ["Microsoft Word", "Instagram", "Windows Explorer", "Adobe Photoshop"], answer: 1, category: "aptitude" },
  { question: "Which of the following is a search engine?", options: ["Wikipedia", "Facebook", "Google", "YouTube"], answer: 2, category: "aptitude" },
  { question: "What is the shortcut key to Copy text?", options: ["Ctrl + V", "Ctrl + X", "Ctrl + Z", "Ctrl + C"], answer: 3, category: "aptitude" },
  { question: "Which of these is a cybersecurity threat?", options: ["Phishing", "Uploading a photo", "Logging into a website", "Sending an email"], answer: 0, category: "cybersecurity" },
  { question: "A 'password' is used to:", options: ["Speed up a computer", "Protect your account from others", "Increase internet speed", "Print documents"], answer: 1, category: "cybersecurity" },
  { question: "What does 'RAM' stand for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Access Module", "Read And Memorize"], answer: 1, category: "aptitude" },
  { question: "Which of these file formats is a video file?", options: [".jpg", ".pdf", ".mp4", ".txt"], answer: 2, category: "aptitude" },
  { question: "What is a 'virus' in computer terms?", options: ["A type of software that helps your computer", "A biological disease", "Malicious software that harms your computer", "A coding language"], answer: 2, category: "cybersecurity" },
  { question: "What does 'PDF' stand for?", options: ["Personal Document Format", "Portable Document Format", "Public Document File", "Personal Data File"], answer: 1, category: "aptitude" },
  { question: "Which of these is NOT a programming language?", options: ["Python", "Java", "HTML", "Google"], answer: 3, category: "ai" },
  { question: "What is the internet?", options: ["A global network of computers", "A software application", "A hardware device", "A type of keyboard"], answer: 0, category: "aptitude" },
  { question: "What does 'USB' stand for?", options: ["Universal Serial Bus", "United System Board", "Ultra Speed Bandwidth", "Universal System Boot"], answer: 0, category: "aptitude" },
  { question: "Which is the best practice for creating a strong password?", options: ["Use your name", "Use '123456'", "Use a mix of letters, numbers and symbols", "Use your birthdate"], answer: 2, category: "cybersecurity" },
];

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    await connectToDatabase();

    // If no questions, seed them
    const count = await Question.countDocuments();
    if (count < 20) {
      await Question.deleteMany({});
      await Question.insertMany(easyQuestions);
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    let matchQuery = {};
    if (quizId === "6a0f596a18618bb44fae456b") {
      matchQuery = { category: { $in: ["cybersecurity", "aptitude"] } };
    } else if (quizId === "6a0f5b3d18618bb44fae456c") {
      matchQuery = { category: { $in: ["ai", "aptitude"] } };
    }

    // Fetch up to 20 random questions
    let questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: 20 } }
    ]);

    // Robust Fallback: if categories are missing or database has outdated schema, return any 20 questions
    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $sample: { size: 20 } }
      ]);
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
