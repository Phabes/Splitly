import { useAuthContext, useFormData, useTranslations } from "@/app/hooks";
import { signUpCall } from "@/app/services";
import { ResponseMessage, SignInResponse } from "@/app/types";
import {
  validateEmail,
  validateSignUpPassword,
  validateRepeatedPassword,
  validateUsername,
} from "@/app/utils";
import { useState } from "react";

type SignUpFailResponse = ResponseMessage & {
  errorFields: Array<{
    field: "email" | "username";
    code: "emailTaken" | "usernameTaken";
    message: string;
  }>;
};

export const useSignUpData = () => {
  const { signUp } = useAuthContext();
  const translations = useTranslations();

  const emailField = useFormData();
  const usernameField = useFormData();
  const passwordField = useFormData();
  const repeatedPasswordField = useFormData();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(translations["loading"]);

  const clearAllErrors = () => {
    emailField.setError(undefined);
    usernameField.setError(undefined);
    passwordField.setError(undefined);
    repeatedPasswordField.setError(undefined);
  };

  const validateSignUp = () => {
    const emailError = validateEmail(emailField.value);
    const usernameError = validateUsername(usernameField.value);
    const passwordError = validateSignUpPassword(passwordField.value);
    const repeatedPasswordError = validateRepeatedPassword(
      passwordField.value,
      repeatedPasswordField.value,
    );

    emailField.setError(emailError ? translations[emailError] : undefined);
    usernameField.setError(
      usernameError ? translations[usernameError] : undefined,
    );
    passwordField.setError(
      passwordError ? translations[passwordError] : undefined,
    );
    repeatedPasswordField.setError(
      repeatedPasswordError ? translations[repeatedPasswordError] : undefined,
    );

    const isError =
      emailError !== undefined ||
      usernameError !== undefined ||
      passwordError !== undefined ||
      repeatedPasswordError !== undefined;

    return isError;
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    // clearAllErrors();
    const isError = validateSignUp();
    if (isError) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await signUpCall(
        emailField.value,
        usernameField.value,
        passwordField.value,
      );

      if (response.ok) {
        const data: SignInResponse = await response.json();
        await signUp(data.userToken, data.refreshToken);
      } else if (response.status === 400) {
        const data: SignUpFailResponse = await response.json();
        if (data.code === "signUp/fieldsValidationError") {
          data.errorFields.forEach((errorField) => {
            if (
              errorField.field === "email" &&
              errorField.code === "emailTaken"
            ) {
              emailField.setError(translations[errorField.code]);
            } else if (
              errorField.field === "username" &&
              errorField.code === "usernameTaken"
            ) {
              usernameField.setError(translations[errorField.code]);
            }
          });
        }
      } else {
        const data: ResponseMessage = await response.json();
        console.error("Server error:", data.message);
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
