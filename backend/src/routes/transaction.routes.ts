import { Router } from "express";
import { deleteTransaction, getTransactionSummary, getTransactions, patchTransaction, postTransaction } from "../controllers/transaction.controller.js";

const router = Router();
router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.post("/", postTransaction);
router.patch("/:id", patchTransaction);
router.delete("/:id", deleteTransaction);
export default router;
