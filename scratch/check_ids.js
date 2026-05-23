const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("projxpertlabs");
    
    // Check questions collection for these IDs
    const aiId = new ObjectId("6a0f5b3d18618bb44fae456c");
    const cyberId = new ObjectId("6a0f596a18618bb44fae456b");
    
    console.log("Checking courses with these IDs...");
    const course1 = await db.collection("courses").findOne({ _id: aiId });
    const course2 = await db.collection("courses").findOne({ _id: cyberId });
    console.log("AI Course exists:", !!course1);
    console.log("Cyber Course exists:", !!course2);
    
    // Check questions collection for these IDs
    console.log("Checking questions with these IDs...");
    const q1 = await db.collection("questions").findOne({ _id: aiId });
    const q2 = await db.collection("questions").findOne({ _id: cyberId });
    console.log("AI Question exists:", !!q1);
    console.log("Cyber Question exists:", !!q2);
    
    // Maybe they are quizIds inside the questions?
    const qByQuizId1 = await db.collection("questions").find({ quizId: "6a0f5b3d18618bb44fae456c" }).toArray();
    console.log("Questions with ai quizId:", qByQuizId1.length);
    
    // List any new JSON files in public or src
    const fs = require('fs');
    console.log("Files in public:", fs.readdirSync('public'));
    
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
