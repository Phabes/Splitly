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
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText("");
    }, 1000);
  };

  const handleSignUp = async () => {
    setLoadingText(translations["loading"]);
    setIsLoading(true);
    // validateSignUp();
    try {
      const response = await fetch("http://{ip_address}}:5000/user/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailField.value,
          username: usernameField.value,
          password: passwordField.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
      } else {
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loadingText,
    emailField,
    usernameField,
    passwordField,
    repeatedPasswordField,
    handleSignUp,
  };
};

export default useSignUpData;
