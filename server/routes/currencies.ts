import { Router } from "express";
import { getCurrencyList, getRate } from "../controllers/currencies.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const routerCurrency = Router();

// GET - currencies
routerCurrency.get("/", authMiddleware, getCurrencyList);
// GET - currency rate
routerCurrency.get("/rate", authMiddleware, getRate);

export default routerCurrency;
