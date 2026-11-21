import { Response } from "express";
import {
  getCachedCurrencies,
  fetchExchangeRate,
  initCurrencies,
} from "@/services/currencies.ts";
import { AuthRequest, CurrencyOption } from "@/types/index.ts";

export const getCurrencyList = async (
  _req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    let currencies: CurrencyOption[] = getCachedCurrencies();

    if (currencies.length === 0) {
      await initCurrencies();
      currencies = getCachedCurrencies();

      if (currencies.length === 0) {
        return res.status(503).json({
          code: "get/getCurrencyList/unavailable",
          message:
            "Currency list is currently unavailable. Please try again later.",
        });
      }
    }

    return res.status(200).json({
      code: "get/getCurrencyList/success",
      message: "Currency list retrieved.",
      currencies,
    });
  } catch (error) {
    return res.status(500).json({
      code: "get/getCurrencyList/error",
      message: "Unexpected error retrieving currency list.",
    });
  }
};

export const getRate = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { from, to } = req.query;

    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      from.trim().length === 0 ||
      to.trim().length === 0
    ) {
      return res.status(400).json({
        code: "get/getRate/invalidParams",
        message: "You must provide valid 'from' and 'to' currency codes.",
      });
    }

    const fromCode: string = from.trim().toUpperCase();
    const toCode: string = to.trim().toUpperCase();
    const rate: number = await fetchExchangeRate(fromCode, toCode);

    return res.status(200).json({
      code: "get/getRate/success",
      message: "Currency rate retrieved.",
      from: fromCode,
      to: toCode,
      rate,
    });
  } catch (error) {
    return res.status(400).json({
      code: "get/getRate/error",
      message: "Could not fetch exchange rate for the provided currencies.",
    });
  }
};
