import { TranslationKeys } from "../constants/translations";

type ValidationResult = TranslationKeys | undefined;

export const fieldRequiredValidation = (field: string): ValidationResult => {
  if (!field) {
    return "fieldRequired";
  }
  return undefined;
};

export default function Index() {
  return null;
}
