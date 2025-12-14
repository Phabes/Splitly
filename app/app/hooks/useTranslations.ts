import { translations } from "../constants/translations";
import { useLanguageContext } from "./useLanguageContext";

export const useTranslations = () => {
  const { language } = useLanguageContext();
  return translations[language];
};

export default useTranslations;
