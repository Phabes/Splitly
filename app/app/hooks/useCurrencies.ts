import { useMemo } from "react";
import {
  getSupportedCurrencies,
  formatCurrency,
} from "react-native-format-currency";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const useCurrencies = () => {
  const currencies = useMemo<Currency[]>(() => {
    const supportedCurrencies = getSupportedCurrencies();

    return supportedCurrencies.map((currency) => {
      const [, , symbol] = formatCurrency({ amount: 0, code: currency.code });

      return {
        code: currency.code,
        name: currency.name,
        symbol: symbol,
      };
    });
  }, []);

  return { currencies };
};

export default useCurrencies;
