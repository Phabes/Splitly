import {
  CurrencyOption,
  FrankfurterCurrenciesResponse,
  FrankfurterLatestResponse,
} from "@/types/index.ts";

let cachedCurrencies: CurrencyOption[] = [];

export const initCurrencies = async (): Promise<void> => {
  try {
    const response = await fetch("https://api.frankfurter.app/currencies");

    if (!response.ok) {
      throw new Error(`Frankfurter API responded with ${response.status}`);
    }

    const data: FrankfurterCurrenciesResponse = await response.json();

    cachedCurrencies = Object.entries(data)
      .map(
        ([code, name]): CurrencyOption => ({
          label: `${name} (${code})`,
          value: code,
        }),
      )
      .sort((a, b) => a.value.localeCompare(b.value));
  } catch (error) {
    console.error("Failed to initialize currencies:", error);
  }
};

export const getCachedCurrencies = (): CurrencyOption[] => {
  return [...cachedCurrencies];
};

export const fetchExchangeRate = async (
  from: string,
  to: string,
): Promise<number> => {
  const normalizedFrom = from.trim().toUpperCase();
  const normalizedTo = to.trim().toUpperCase();

  if (normalizedFrom === normalizedTo) {
    return 1;
  }

  try {
    const url = new URL("https://api.frankfurter.app/latest");
    url.searchParams.set("base", normalizedFrom);
    url.searchParams.set("symbols", normalizedTo);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate (${response.status})`);
    }

    const data: FrankfurterLatestResponse = await response.json();
    const rate: number | undefined = data.rates?.[normalizedTo];

    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new Error(`Rate not found for ${normalizedTo}`);
    }

    return rate;
  } catch (error) {
    console.error(
      `Exchange Rate Error (${normalizedFrom} -> ${normalizedTo}):`,
      error,
    );
    throw error;
  }
};
