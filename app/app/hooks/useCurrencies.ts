import { useState, useEffect, useMemo } from "react";
import { Currency, CurrencyListResponse, ResponseMessage } from "@/app/types";
import useAuthenticatedApi from "./useAuthenticatedApi";
import { getCurrencyListCall } from "../services/currencies";

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
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

        const data: CurrencyListResponse = await response.json();

        setCurrencies(data.currencies);
      } catch (error) {
        // Error during fetching currencies
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, isLoading };
};

export default useCurrencies;
