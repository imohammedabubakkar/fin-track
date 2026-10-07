import mongoose from "mongoose";

const fraudAlertSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  merchant: { type: String, required: true },
  risk: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
  score: { type: Number, required: true },
  status: { type: String, default: "OPEN" },
  reason: String,
  detectedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const FraudAlert = mongoose.model("FraudAlert", fraudAlertSchema, "fraudalerts");
