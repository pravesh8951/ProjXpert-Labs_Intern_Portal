const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("projxpertlabs");
    const coursesCol = db.collection("courses");

    const aiCourse = await coursesCol.findOne({ domain: "ai" });
    if (aiCourse && aiCourse.months && aiCourse.months[0].weeks && aiCourse.months[0].weeks[0].days) {
      console.log(JSON.stringify(aiCourse.months[0].weeks[0].days[0], null, 2));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
