import { Router } from "express";
import { getUsers, postLoginLog, postUser } from "../controllers/user.controller.js";

const router = Router();
router.get("/", getUsers);
router.post("/login-log", postLoginLog);
router.post("/", postUser);
export default router;
