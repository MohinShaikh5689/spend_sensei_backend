import express from "express";
import { createTransaction, deleteTransaction, editTransaction, getTransactionsByMonth, getTransactions } from "../controllers/transaction.controller.js";
import { authChecker } from "../middleware/authchecker.js";

const router = express.Router();

router.post("/", authChecker, createTransaction);
router.get("/", authChecker, getTransactions);
router.post("/get", authChecker, getTransactionsByMonth);
router.put("/:transactionId", authChecker, editTransaction);
router.delete("/:transactionId", authChecker, deleteTransaction);

export default router;

