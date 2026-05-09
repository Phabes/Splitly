import { useState, useEffect, useMemo } from "react";
import { ResponseMessage, SelectData } from "@/app/types";
import useAuthenticatedApi from "./useAuthenticatedApi";
import { getCurrencyListCall } from "../services/currencies";

export const useCurrencies = (selectedValue?: string) => {
  const [currencies, setCurrencies] = useState<Array<SelectData>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const request = useAuthenticatedApi();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        const response = await request(getCurrencyListCall);

        if (!response.ok) {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }

        const data = await response.json();

        setCurrencies(data.currencies);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const sortedCurrencies = useMemo(() => {
    if (!currencies.length) return [];

    return [...currencies].sort((a, b) => {
      if (a.value === selectedValue) {
        return -1;
      }

      if (b.value === selectedValue) {
        return 1;
      }

      return a.label.localeCompare(b.label);
    });
  }, [currencies, selectedValue]);

  return { currencies: sortedCurrencies, isLoading };
};

export default useCurrencies;
