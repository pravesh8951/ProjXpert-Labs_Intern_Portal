const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("projxpertlabs");
    
    console.log("Fetching all users...");
    const users = await db.collection("users").find({}).toArray();
    
    if (users.length === 0) {
      console.log("No users found.");
      return;
    }

    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, XP: ${u.xp}, Streak: ${u.streak}, Completed Days: ${u.completedDays}`);
    });

    // Let's reset the first user or all users to the default state for testing
    // Change user fields:
    // xp: 0, level: 1, streak: 1, unlockedDays: [1], completedDays: [], completedReadings: [], completedQuizzes: [], dailyQuizScores: [], totalProgress: 0
    for (const u of users) {
      console.log(`Resetting user ${u.email} to default learning flow state...`);
      await db.collection("users").updateOne(
        { _id: u._id },
        {
          $set: {
            xp: 0,
            level: 1,
            streak: 1,
            currentDay: 1,
            unlockedDays: [1],
            completedDays: [],
            completedReadings: [],
            completedQuizzes: [],
            dailyQuizScores: [],
            totalProgress: 0,
            quizHistory: [],
            lastActiveDate: null
          }
        }
      );
      console.log(`Successfully reset ${u.email}!`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
