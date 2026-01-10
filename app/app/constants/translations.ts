import en from "./translations/en.json";
import pl from "./translations/pl.json";

export const SUPPORTED_LANGUAGES = ["en", "pl"] as const;

export type LanguageKeys = (typeof SUPPORTED_LANGUAGES)[number];

export type TranslationKeys =
  | "loading"
  | "email"
  | "username"
  | "password"
  | "repeatPassword"
  | "signUp"
  | "signIn"
  | "fieldRequired"
  | "notValidEmail"
  | "tooShortPassword"
  | "weakPassword"
  | "confirmPassword"
  | "matchPasswords"
  | "emailTaken"
  | "usernameTaken"
  | "userNotFound"
  | "invalidPassword"
  | "searchFriends";

export const translations: Record<
  LanguageKeys,
  Record<TranslationKeys, string>
> = {
  en: en,
  pl: pl,
};

export default function Index() {
  return null;
}
