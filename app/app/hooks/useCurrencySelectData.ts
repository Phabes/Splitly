import { useMemo } from "react";
import { Currency, SelectData } from "../types";

type FormatOptions = {
  formatLabel?: (currency: Currency) => string;
  formatValue?: (currency: Currency) => string;
};

export const useCurrencySelectData = (
  currencies: Currency[],
  options?: FormatOptions,
) => {
  const selectData = useMemo<SelectData[]>(() => {
    return currencies.map((currency) => {
      const label = options?.formatLabel
        ? options.formatLabel(currency)
        : `${currency.code} - ${currency.name} (${currency.symbol})`;

      const value = options?.formatValue
        ? options.formatValue(currency)
        : currency.code;

      return { label, value };
    });
  }, [currencies, options?.formatLabel, options?.formatValue]);

  return selectData;
};

export default useCurrencySelectData;
