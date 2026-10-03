import { Router } from "express";
import { getUsers, postUser } from "../controllers/user.controller.js";

const router = Router();
router.get("/", getUsers);
router.post("/", postUser);
export default router;
