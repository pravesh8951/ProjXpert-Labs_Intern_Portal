const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB\n");
    const db = client.db("projxpertlabs");
    
    // 1. Check all distinct categories in questions collection
    const questionsCol = db.collection("questions");
    const categories = await questionsCol.distinct("category");
    console.log("All distinct categories in questions:", categories);
    
    // 2. Count by category
    for (const cat of categories) {
      const count = await questionsCol.countDocuments({ category: cat });
      console.log(`  ${cat}: ${count} questions`);
    }
    
    // 3. Total count
    const total = await questionsCol.countDocuments();
    console.log(`\nTotal questions: ${total}`);
    
    // 4. Sample one question to see its schema
    const sample = await questionsCol.findOne();
    console.log("\nSample question schema:", JSON.stringify(sample, null, 2));
    
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
