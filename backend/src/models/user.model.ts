import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  username: String,
  role: { type: String, enum: ["ADMIN", "ANALYST", "USER"], default: "USER" },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  phone: String,
  dob: String,
  registered: String,
  activity: String,
  timezone: String,
  passwordHash: String,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
