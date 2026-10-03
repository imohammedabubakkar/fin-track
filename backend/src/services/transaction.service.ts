import { Transaction } from "../models/transaction.model.js";

export type TransactionQuery = {
  page?: number;
  limit?: number;
  status?: string;
  risk?: string;
  type?: string;
  search?: string;
  from?: Date;
  to?: Date;
};

export async function listTransactions(query: TransactionQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.risk) filter.risk = query.risk;
  if (query.type) filter.type = query.type;
  if (query.from || query.to) {
    const date: Record<string, Date> = {};
    if (query.from) date.$gte = query.from;
    if (query.to) date.$lte = query.to;
    filter.createdAt = date;
  }
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matcher = new RegExp(escaped, "i");
    filter.$or = [{ customer: matcher }, { merchant: matcher }, { description: matcher }, { externalId: matcher }];
  }
  const [data, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Transaction.countDocuments(filter),
  ]);
  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function transactionSummary() {
  const [total, amount, statuses, risks] = await Promise.all([
    Transaction.countDocuments(),
    Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Transaction.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Transaction.aggregate([{ $group: { _id: "$risk", count: { $sum: 1 } } }]),
  ]);
  return {
    total,
    totalAmount: amount[0]?.total ?? 0,
    byStatus: Object.fromEntries(statuses.filter(row => row._id).map(row => [row._id, row.count])),
    byRisk: Object.fromEntries(risks.filter(row => row._id).map(row => [row._id, row.count])),
  };
}

export function saveTransaction(input: Record<string, unknown>) {
  const id = input.id;
  if (typeof id !== "string" || !id) throw new Error("A transaction id is required");
  return Transaction.findOneAndUpdate(
    { externalId: id }, { ...input, externalId: id },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  ).lean();
}

export const updateTransaction = (id: string, input: Record<string, unknown>) =>
  Transaction.findOneAndUpdate({ externalId: id }, input, { new: true, runValidators: true }).lean();

export const removeTransaction = (id: string) => Transaction.findOneAndDelete({ externalId: id });
