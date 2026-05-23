const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("projxpertlabs");
    const collection = db.collection("usercourseprogresses");

    const cursor = await collection.aggregate([
      {
        $group: {
          _id: { userId: "$userId" },
          count: { $sum: 1 },
          docs: { $push: "$_id" },
          bestDoc: { $max: { xp: "$xp", _id: "$_id" } }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    let deletedCount = 0;
    for (const group of cursor) {
      console.log(`Found ${group.count} duplicates for user ${group._id.userId}`);
      const bestId = group.bestDoc._id;
      const idsToDelete = group.docs.filter(id => id.toString() !== bestId.toString());
      
      const result = await collection.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount += result.deletedCount;
      console.log(`Deleted ${result.deletedCount} duplicates for user ${group._id.userId}`);
    }

    console.log(`Total duplicate documents deleted: ${deletedCount}`);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
