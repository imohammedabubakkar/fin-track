import mongoose from "mongoose";
import { FraudAlert } from "../models/fraud-alert.model.js";
import { Setting } from "../models/setting.model.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

let connection: Promise<typeof mongoose> | undefined;

mongoose.connection.on("connected", () => {
  console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
});

mongoose.connection.on("reconnected", () => {
  console.log("[Database] MongoDB connection restored");
});

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB disconnected");
});

mongoose.connection.on("error", error => {
  console.error("[Database] MongoDB connection error:", error.message);
});

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing. Set MONGO_URI or MONGODB_URI in backend/.env.");
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await connection;
    const collections = [User, Transaction, FraudAlert, Setting];
    await Promise.all(collections.map(async model => {
      try {
        await model.createCollection();
      } catch (error) {
        if ((error as { code?: number }).code !== 48) throw error;
      }
    }));
    console.log(`[Database] Collections ready in "${mongoose.connection.name}": ${collections.map(model => model.collection.name).sort().join(", ")}`);
    return mongoose;
  } catch (error) {
    connection = undefined;
    throw error;
  }
}
