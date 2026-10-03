import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | undefined;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing. Set MONGO_URI or MONGODB_URI in backend/.env.");
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await connection;
    console.log("Connected to MongoDB");
    return mongoose;
  } catch (error) {
    connection = undefined;
    throw error;
  }
}
