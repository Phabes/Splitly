import en from "./translations/en.json";
import pl from "./translations/pl.json";

export type LanguageKeys = "en" | "pl";

export type TranslationKeys =
  | "email"
  | "username"
  | "password"
  | "repeatPassword";

export const translations: Record<
  LanguageKeys,
  Record<TranslationKeys, string>
> = {
  en: en,
  pl: pl,
};

export default translations;
