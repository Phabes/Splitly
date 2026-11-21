import { getCachedCurrencies } from "@/services/currencies.ts";

export const validCurrency = (currency: string): boolean => {
  if (typeof currency !== "string" || currency.trim().length === 0) {
    return false;
  }

  const availableCurrencies = getCachedCurrencies();

  if (!Array.isArray(availableCurrencies)) {
    return false;
  }

  const normalizedCurrency: string = currency.trim().toUpperCase();

  return availableCurrencies.some(
    (c): boolean =>
      typeof c === "object" &&
      c !== null &&
      "value" in c &&
      typeof c.value === "string" &&
      c.value.toUpperCase() === normalizedCurrency,
  );
};
