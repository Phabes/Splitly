import { useFormData, useTranslations } from "@/app/hooks";
import { validatePassword, validateUsername } from "@/app/utils";
import { useState } from "react";

export const useSignInData = () => {
  const translations = useTranslations();

  const usernameField = useFormData();
  const passwordField = useFormData();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const clearAllErrors = () => {
    usernameField.setError(undefined);
    passwordField.setError(undefined);
  };

  const validateSignIn = () => {
    setLoadingText(translations["loading"]);
    setIsLoading(true);
    const usernameError = validateUsername(usernameField.value);
    const passwordError = validatePassword(passwordField.value);
    usernameField.setError(
      usernameError ? translations[usernameError] : undefined
    );
    passwordField.setError(
      passwordError ? translations[passwordError] : undefined
    );
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText("");
    }, 1000);
  };

  return {
    isLoading,
    loadingText,
    usernameField,
    passwordField,
    validateSignIn,
  };
};

export default useSignInData;
