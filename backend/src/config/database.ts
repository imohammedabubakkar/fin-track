import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | undefined;

mongoose.connection.on("connecting", () => {
  console.log("Connecting to MongoDB...");
});

mongoose.connection.on("connected", () => {
  const { host, name } = mongoose.connection;
  console.log(`MongoDB connected${name ? ` to database "${name}"` : ""}${host ? ` on ${host}` : ""}`);
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB connection restored");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", error => {
  console.error("MongoDB connection error:", error.message);
});

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing. Set MONGO_URI or MONGODB_URI in backend/.env.");
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await connection;
    return mongoose;
  } catch (error) {
    connection = undefined;
    throw error;
  }
}
