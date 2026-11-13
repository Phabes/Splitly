import { useMemo } from "react";
import { SelectData } from "../types";
import { useTranslations } from "./useTranslations";
import { COUNTRY_CODES } from "../constants/countries";

export const useCountries = (): SelectData[] => {
  const translations = useTranslations();

  return useMemo(() => {
    return COUNTRY_CODES.map((code) => ({
      label: translations[`country_${code}`],
      value: code,
    }));
  }, [translations]);
};

export default useCountries;
