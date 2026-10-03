import type { NextFunction, Request, Response } from "express";
import * as users from "../services/user.service.js";

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await users.listUsers()); } catch (error) { next(error); }
}

export async function postUser(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json(await users.saveUser(req.body)); } catch (error) { next(error); }
}
