const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("projxpertlabs");
    
    const cyberId = new ObjectId("6a0f596a18618bb44fae456b");
    const course = await db.collection("courses").findOne({ _id: cyberId });
    
    console.log(JSON.stringify(course.dailyQuizzes[0], null, 2));
    console.log(JSON.stringify(course.dailyQuizzes[1], null, 2));
    
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
