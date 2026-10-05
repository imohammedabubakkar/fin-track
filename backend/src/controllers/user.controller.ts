import type { NextFunction, Request, Response } from "express";
import * as users from "../services/user.service.js";

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await users.listUsers()); } catch (error) { next(error); }
}

export async function postUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await users.saveUser(req.body);
    console.log(`[DB] User saved: id=${user?.externalId ?? req.body.id}, name=${user?.name ?? req.body.name}, role=${user?.role ?? req.body.role}`);
    res.status(201).json(user);
  } catch (error) { next(error); }
}

export function postLoginLog(req: Request, res: Response) {
  const { username, role, success } = req.body as { username?: unknown; role?: unknown; success?: unknown };
  if (typeof username !== "string" || typeof role !== "string" || typeof success !== "boolean") {
    return res.status(400).json({ error: "username, role, and success are required" });
  }
  console.log(`[AUTH] Login ${success ? "succeeded" : "failed"}: username=${username.trim().slice(0, 80)}, role=${role.slice(0, 20)}`);
  return res.status(204).end();
}
