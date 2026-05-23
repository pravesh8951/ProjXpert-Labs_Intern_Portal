const mongoose = require("mongoose");

const uri = "mongodb://pravesh8951_db_user:uLJggPRfXCAuotjn@ac-xxlgtbh-shard-00-00.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-01.pvobvpd.mongodb.net:27017,ac-xxlgtbh-shard-00-02.pvobvpd.mongodb.net:27017/projxpertlabs?replicaSet=atlas-151ysl-shard-0&ssl=true&authSource=admin";

async function main() {
  await mongoose.connect(uri);
  
  // Just load the models to check if they crash
  try {
    const UserCourseProgress = require("./src/models/UserCourseProgress").default;
    console.log("Model loaded successfully.");
    
    // Find one document if any exists
    const doc = await UserCourseProgress.findOne({});
    console.log("Found doc:", doc ? "Yes" : "No");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    mongoose.connection.close();
  }
}

main();
