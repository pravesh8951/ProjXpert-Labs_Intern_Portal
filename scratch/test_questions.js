const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("projxpertlabs");
    const questionsCol = db.collection("questions");

    const matchQueryAI = { category: { $in: ["ai", "aptitude"] } };
    const matchQueryCyber = { category: { $in: ["cybersecurity", "aptitude"] } };

    const questionsAI = await questionsCol.aggregate([
      { $match: matchQueryAI },
      { $sample: { size: 20 } }
    ]).toArray();

    const questionsCyber = await questionsCol.aggregate([
      { $match: matchQueryCyber },
      { $sample: { size: 20 } }
    ]).toArray();

    console.log("AI/Aptitude questions length:", questionsAI.length);
    console.log("Cybersecurity/Aptitude questions length:", questionsCyber.length);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
