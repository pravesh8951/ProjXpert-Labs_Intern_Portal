const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("projxpertlabs");
    const coursesCol = db.collection("courses");
    const courses = await coursesCol.find({}).toArray();
    for (const c of courses) {
      console.log("-----------------------------------------");
      console.log(`ID: ${c._id}`);
      console.log(`Title: ${c.title}`);
      console.log(`Domain: ${c.domain}`);
      console.log(`Months length: ${c.months ? c.months.length : 'undefined'}`);
      if (c.months) {
        c.months.forEach((m, idx) => {
          console.log(`  Month ${idx + 1}: ${m.title} (Goal: ${m.goal})`);
          console.log(`    Weeks: ${m.weeks ? m.weeks.length : 0}`);
          if (m.weeks) {
            m.weeks.forEach(w => {
              console.log(`      Week ${w.week}: ${w.title} (${w.days ? w.days.length : 0} days)`);
              if (w.days && w.days.length > 0) {
                console.log(`        Day ${w.days[0].day}: ${w.days[0].title}`);
              }
            });
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
