import type { NextFunction, Request, Response } from "express";
import * as transactions from "../services/transaction.service.js";

export async function getTransactions(_req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, status, risk, type, search, from, to } = _req.query;
    const date = (value: unknown) => typeof value === "string" && !Number.isNaN(Date.parse(value)) ? new Date(value) : undefined;
    res.json(await transactions.listTransactions({
      page: Number(page) || 1,
      limit: Number(limit) || 50,
      status: typeof status === "string" ? status : undefined,
      risk: typeof risk === "string" ? risk : undefined,
      type: typeof type === "string" ? type : undefined,
      search: typeof search === "string" ? search.trim().slice(0, 100) : undefined,
      from: date(from),
      to: date(to),
    }));
  } catch (error) { next(error); }
}

export async function getTransactionSummary(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await transactions.transactionSummary()); } catch (error) { next(error); }
}

export async function postTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await transactions.saveTransaction(req.body);
    console.log(`[DB] Transaction saved: id=${record?.externalId ?? req.body.id}, amount=${record?.amount ?? req.body.amount} ${record?.currency ?? req.body.currency ?? "USD"}`);
    res.status(201).json(record);
  } catch (error) { next(error); }
}

export async function patchTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await transactions.updateTransaction(req.params.id, req.body);
    if (!record) return res.status(404).json({ error: "Transaction not found" });
    res.json(record);
  } catch (error) { next(error); }
}

export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await transactions.removeTransaction(req.params.id);
    if (!record) return res.status(404).json({ error: "Transaction not found" });
    res.status(204).end();
  } catch (error) { next(error); }
}
