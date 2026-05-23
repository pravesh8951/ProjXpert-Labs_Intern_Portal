// scratch/check_progress.js
// Run with: node scratch/check_progress.js

const fs = require("fs");
const path = require("path");

// Manually load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  const db = mongoose.connection.db;

  // Show all UserCourseProgress documents
  const docs = await db.collection("usercourseprogresses").find({}).toArray();
  console.log(`Found ${docs.length} UserCourseProgress document(s):\n`);

  for (const doc of docs) {
    console.log("=== Progress Document ===");
    console.log("userId:", doc.userId);
    console.log("xp:", doc.xp, "| streak:", doc.streak, "| level:", doc.level);
    console.log("completedDays:", doc.completedDays);
    console.log("unlockedDays:", doc.unlockedDays);
    console.log("lastActiveDate:", doc.lastActiveDate);
    console.log("\nQuiz Progress (completed days only):");
    (doc.quizProgress || [])
      .filter(q => q.completed || q.totalMarks > 0)
      .forEach(q => console.log(`  Day ${q.day}: score=${q.score}/${q.totalMarks} (${q.percentage}%) completed=${q.completed}`));
    console.log("\nReading Progress (completed days only):");
    (doc.readingProgress || [])
      .filter(r => r.completed)
      .forEach(r => console.log(`  Day ${r.day}: completed=true`));

    // Compute what currentDay would be
    const computedCurrentDay = doc.completedDays.length > 0
      ? Math.max(...doc.completedDays) + 1
      : 1;
    console.log("\nComputed currentDay:", computedCurrentDay);
    console.log("=".repeat(40));
  }

  // Also check users
  const users = await db.collection("users").find({}, {
    projection: { name: 1, email: 1, currentDay: 1, xp: 1, streak: 1, internshipPlan: 1, paymentStatus: 1 }
  }).toArray();
  console.log("\n=== Users ===");
  users.forEach(u => {
    console.log(`${u.name} (${u.email}): currentDay=${u.currentDay}, xp=${u.xp}, streak=${u.streak}, plan=${u.internshipPlan}, payment=${u.paymentStatus}`);
  });

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(console.error);
