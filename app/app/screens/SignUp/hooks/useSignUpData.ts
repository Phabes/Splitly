import { useFormData, useTranslations } from "@/app/hooks";
import {
  validateEmail,
  validatePassword,
  validateRepeatedPassword,
  validateUsername,
} from "@/app/utils";
import { useState } from "react";

export const useSignUpData = () => {
  const translations = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const emailField = useFormData();
  const usernameField = useFormData();
  const passwordField = useFormData();
  const repeatedPasswordField = useFormData();

  const clearAllErrors = () => {
    emailField.setError(undefined);
    usernameField.setError(undefined);
    passwordField.setError(undefined);
    repeatedPasswordField.setError(undefined);
  };

  const validateSignUp = () => {
    setLoadingText(translations["loading"]);
    setIsLoading(true);
    const emailError = validateEmail(emailField.value);
    const usernameError = validateUsername(usernameField.value);
    const passwordError = validatePassword(passwordField.value);
    const repeatedPasswordError = validateRepeatedPassword(
      passwordField.value,
      repeatedPasswordField.value
    );
    emailField.setError(emailError ? translations[emailError] : undefined);
    usernameField.setError(
      usernameError ? translations[usernameError] : undefined
    );
    passwordField.setError(
      passwordError ? translations[passwordError] : undefined
    );
    repeatedPasswordField.setError(
      repeatedPasswordError ? translations[repeatedPasswordError] : undefined
    );
    // emailField.setError(emailError);
    // usernameField.setError(usernameError);
    // passwordField.setError(passwordError);
    // repeatedPasswordField.setError(repeatedPasswordError);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText("");
    }, 1000);
  };

  return {
    isLoading,
    loadingText,
    emailField,
    usernameField,
    passwordField,
    repeatedPasswordField,
    validateSignUp,
  };
};

export default useSignUpData;
