import { getCachedCurrencies } from "@/services/currencies.ts";

export const validCurrency = (currency: string) => {
  const availableCurrencies = getCachedCurrencies();

  return availableCurrencies.some((c) => c.value === currency.toUpperCase());
};
