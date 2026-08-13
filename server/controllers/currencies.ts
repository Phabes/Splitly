import { Response } from "express";
import {
  getCachedCurrencies,
  fetchExchangeRate,
  initCurrencies,
} from "../services/currencies.ts";
import { AuthRequest } from "@/middleware/authMiddleware.ts";

export const getCurrencyList = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  let currencies = getCachedCurrencies();

  if (currencies.length === 0) {
    await initCurrencies();

    currencies = getCachedCurrencies();

    if (currencies.length === 0) {
      return res.status(503).json({
        code: "getCurrencies/error",
        message:
          "Currency list is currently unavailable. Please try again later.",
      });
    }
  }

  return res.status(200).json({
    code: "getCurrencies/success",
    message: "Currency list retrieved.",
    currencies,
  });
};

export const getRate = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { from, to } = req.query;

    if (!from || !to || typeof from !== "string" || typeof to !== "string") {
      return res.status(400).json({
        code: "getCurrencyRate/invalid-params",
        message: "You must provide valid 'from' and 'to' currency codes.",
      });
    }

    const rate = await fetchExchangeRate(from.toUpperCase(), to.toUpperCase());

    return res.status(200).json({
      code: "getCurrencyRate/success",
      message: "Currency rate retrieved.",
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate,
    });
  } catch (error) {
    return res.status(400).json({
      code: "getCurrencyRate/error",
      message: "Could not fetch exchange rate for the provided currencies.",
    });
  }
};
