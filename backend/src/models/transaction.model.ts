import mongoose, { type InferSchemaType } from "mongoose";

const transactionSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  ownerId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  merchant: { type: String, required: true },
  location: String,
  type: String,
  description: String,
  date: String,
  risk: String,
  score: Number,
  status: String,
}, { timestamps: true, strict: false });

export type TransactionDocument = InferSchemaType<typeof transactionSchema>;
export const Transaction = mongoose.model("Transaction", transactionSchema);
