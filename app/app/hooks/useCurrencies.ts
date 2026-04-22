import { useState, useEffect } from "react";
import { SelectData } from "@/app/types";

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Array<SelectData>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://api.frankfurter.app/currencies");

        if (!response.ok) {
          throw new Error(`Failed to fetch currencies: ${response.status}`);
        }

        const data: Record<string, string> = await response.json();

        const formattedCurrencies: Array<SelectData> = Object.entries(data)
          .map(([code, name]) => ({
            label: `${name} (${code})`,
            value: code,
          }))
          .sort((a, b) => (a.value < b.value ? -1 : 1));

        setCurrencies(formattedCurrencies);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("useCurrencies Error:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, isLoading, error };
};

export default useCurrencies;
