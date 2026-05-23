// scratch/fix_progress.js
// Fixes: 1) removes duplicate UserCourseProgress docs, 2) syncs user.currentDay

const fs = require("fs");
const path = require("path");

// Load .env.local
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
const { ObjectId } = require("mongodb");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  console.log("Connected to MongoDB\n");

  // ── 1. Fix duplicate UserCourseProgress documents ──────────────────────────
  console.log("=== Step 1: Fix duplicate UserCourseProgress documents ===");
  const allDocs = await db.collection("usercourseprogresses").find({}).toArray();
  
  // Group by userId
  const byUser = {};
  for (const doc of allDocs) {
    const uid = doc.userId.toString();
    if (!byUser[uid]) byUser[uid] = [];
    byUser[uid].push(doc);
  }

  for (const [uid, docs] of Object.entries(byUser)) {
    if (docs.length > 1) {
      console.log(`\nUser ${uid} has ${docs.length} progress docs — deduplicating...`);
      // Keep the one with most completedDays (most data)
      docs.sort((a, b) => (b.completedDays?.length || 0) - (a.completedDays?.length || 0));
      const keeper = docs[0];
      const toDelete = docs.slice(1);
      for (const d of toDelete) {
        await db.collection("usercourseprogresses").deleteOne({ _id: d._id });
        console.log(`  Deleted empty/duplicate doc ${d._id} (completedDays: [${d.completedDays}])`);
      }
      console.log(`  Kept doc ${keeper._id} (completedDays: [${keeper.completedDays}], xp: ${keeper.xp})`);
    }
  }
  console.log("Duplicate cleanup done.\n");

  // ── 2. Sync user.currentDay with progress docs ─────────────────────────────
  console.log("=== Step 2: Sync user.currentDay with completedDays ===");
  const progressDocs = await db.collection("usercourseprogresses").find({}).toArray();
  
  for (const prog of progressDocs) {
    const computedCurrentDay = prog.completedDays.length > 0
      ? Math.max(...prog.completedDays) + 1
      : 1;
    
    // Ensure unlockedDays contains all needed days
    const unlockedSet = new Set(prog.unlockedDays || [1]);
    unlockedSet.add(1); // always unlock day 1
    for (const cd of (prog.completedDays || [])) {
      unlockedSet.add(cd + 1); // unlock next day after each completed
    }
    const newUnlocked = Array.from(unlockedSet).sort((a, b) => a - b);
    
    // Update the progress doc
    await db.collection("usercourseprogresses").updateOne(
      { _id: prog._id },
      { $set: { unlockedDays: newUnlocked } }
    );

    // Update the User model
    const result = await db.collection("users").updateOne(
      { _id: prog.userId },
      { $set: { currentDay: computedCurrentDay } }
    );
    
    console.log(`User ${prog.userId}: currentDay → ${computedCurrentDay}, unlockedDays → [${newUnlocked}] (matched: ${result.matchedCount})`);
  }

  // ── 3. Verify ──────────────────────────────────────────────────────────────
  console.log("\n=== Step 3: Verification ===");
  const users = await db.collection("users").find({}, {
    projection: { name: 1, email: 1, currentDay: 1, xp: 1, streak: 1 }
  }).toArray();
  users.forEach(u => console.log(`  ${u.name}: currentDay=${u.currentDay}, xp=${u.xp}, streak=${u.streak}`));

  console.log("\nFinal progress docs:");
  const finalDocs = await db.collection("usercourseprogresses").find({}).toArray();
  finalDocs.forEach(d => {
    console.log(`  userId=${d.userId}: completedDays=[${d.completedDays}], unlockedDays=[${d.unlockedDays}], xp=${d.xp}, streak=${d.streak}`);
  });

  await mongoose.disconnect();
  console.log("\n✅ All done!");
}

main().catch(console.error);
