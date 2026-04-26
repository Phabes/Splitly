import { Router } from "express";
import { getCurrencyList, getRate } from "../controllers/currencies.ts";
import { protect } from "../middleware/authMiddleware.ts";

const routerCurrency = Router();

// GET - currencies
routerCurrency.get("/", protect, getCurrencyList);
// GET - currency rate
routerCurrency.get("/rate", protect, getRate);

export default routerCurrency;
