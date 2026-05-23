const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("projxpertlabs");
    const coursesCol = db.collection("courses");

    // Fix: update the AI course domain from "Artificial Intelligence" to "ai"
    // so it matches what the dashboard fetches (/api/courses?domain=ai)
    const result = await coursesCol.updateOne(
      { domain: "Artificial Intelligence" },
      { $set: { domain: "ai" } }
    );

    console.log("Update result:", result.matchedCount, "matched,", result.modifiedCount, "modified");

    // Verify
    const aiCourse = await coursesCol.findOne({ domain: "ai" });
    if (aiCourse) {
      console.log("✅ AI course now has domain:", aiCourse.domain);
      console.log("   Title:", aiCourse.title);
      console.log("   Months count:", aiCourse.months ? aiCourse.months.length : 'none');
    } else {
      console.log("❌ Could not find AI course with domain 'ai'");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
