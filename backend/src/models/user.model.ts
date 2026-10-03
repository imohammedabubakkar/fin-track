import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  role: { type: String, enum: ["ADMIN", "ANALYST", "USER"], default: "USER" },
  timezone: String,
  passwordHash: String,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
