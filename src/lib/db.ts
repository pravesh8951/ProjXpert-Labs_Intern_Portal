import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: true,
      maxPoolSize: 10,
    };

    console.log(`Connecting to MongoDB (URI starts with: ${MONGODB_URI!.substring(0, 20)}...)`);
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    }).catch(err => {
      console.error("Mongoose connection promise rejected:", err.message);
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Detailed Connection Error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
