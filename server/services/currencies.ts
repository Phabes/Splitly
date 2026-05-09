export interface CurrencyOption {
  label: string;
  value: string;
}

let cachedCurrencies: CurrencyOption[] = [];

export const initCurrencies = async (): Promise<void> => {
  try {
    const response = await fetch("https://api.frankfurter.app/currencies");

    if (!response.ok) {
      throw new Error(`Frankfurter API responded with ${response.status}`);
    }

    const data: Record<string, string> = await response.json();

    cachedCurrencies = Object.entries(data)
      .map(([code, name]) => ({
        label: `${name} (${code})`,
        value: code,
      }))
      .sort((a, b) => (a.value > b.value ? 1 : -1));
  } catch (error) {
    console.error("Failed to initialize currencies.");
  }
};

export const getCachedCurrencies = (): CurrencyOption[] => {
  return cachedCurrencies;
};

export const fetchExchangeRate = async (
  from: string,
  to: string,
): Promise<number> => {
  if (from === to) {
    return 1;
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?base=${from}&symbols=${to}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();

    const rate = data.rates[to];

    if (!rate) {
      throw new Error(`Rate not found for ${to}`);
    }

    return rate;
  } catch (error) {
    console.error(`Exchange Rate Error (${from} -> ${to}):`, error);
    throw error;
  }
};
