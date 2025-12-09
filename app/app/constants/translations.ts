import en from "./translations/en.json";
import pl from "./translations/pl.json";

export type LanguageKeys = "en" | "pl";

export type TranslationKeys =
  | "loading"
  | "email"
  | "username"
  | "password"
  | "repeatPassword"
  | "signUp"
  | "signIn";

export const translations: Record<
  LanguageKeys,
  Record<TranslationKeys, string>
> = {
  en: en,
  pl: pl,
};

export default translations;
