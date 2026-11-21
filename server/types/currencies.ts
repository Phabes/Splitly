export interface CurrencyOption {
  label: string;
  value: string;
}

export type FrankfurterCurrenciesResponse = Record<string, string>;

export interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}
