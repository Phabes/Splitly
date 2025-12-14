import { LanguageKeys } from "@/app/constants/translations";
import { createContext } from "react";

type LanguageContextType = {
  language: LanguageKeys;
  setLanguageCode: (lang: LanguageKeys) => Promise<void>;
  isLanguageLoading: boolean;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export default LanguageContext;
