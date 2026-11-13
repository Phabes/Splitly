import { Router } from "express";
import { createBill } from "@/controllers/bills.ts";
import { authMiddleware } from "@/middleware/authMiddleware.ts";
import { groupMiddleware } from "@/middleware/groupMiddleware.ts";

const routerBill = Router();

// POST - create a new bill
routerBill.post("/", authMiddleware, groupMiddleware, createBill);

export default routerBill;
