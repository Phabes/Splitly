import translations, { LanguageKeys } from "../constants/translations";

export const useTranslations = (language: LanguageKeys) => {
  return translations[language];
};

export default useTranslations;
