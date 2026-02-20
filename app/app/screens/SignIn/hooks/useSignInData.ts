import { useAuthContext, useFormData, useTranslations } from "@/app/hooks";
import { signInCall } from "@/app/services";
import {
  ResponseMessage,
  SignInFailResponse,
  SignInResponse,
} from "@/app/types";
import { validateSignInPassword, validateUsername } from "@/app/utils";
import { useState } from "react";

export const useSignInData = () => {
  const { signIn } = useAuthContext();
  const translations = useTranslations();

  const usernameField = useFormData();
  const passwordField = useFormData();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(translations["loading"]);

  const clearAllErrors = () => {
    usernameField.setError(undefined);
    passwordField.setError(undefined);
  };

  const validateSignIn = () => {
    const usernameError = validateUsername(usernameField.value);
    const passwordError = validateSignInPassword(passwordField.value);
    usernameField.setError(
      usernameError ? translations[usernameError] : undefined,
    );
    passwordField.setError(
      passwordError ? translations[passwordError] : undefined,
    );

    const isError = usernameError !== undefined || passwordError !== undefined;

    return isError;
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    // clearAllErrors();
    const isError = validateSignIn();
    if (isError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await signInCall(
        usernameField.value,
        passwordField.value,
      );

      if (response.ok) {
        const data: SignInResponse = await response.json();
        await signIn(data.userToken, data.refreshToken);
      } else if (response.status === 400) {
        const data: SignInFailResponse = await response.json();
        if (data.code === "signIn/fieldsValidationError") {
          data.errorFields.forEach((errorField) => {
            if (
              errorField.field === "username" &&
              errorField.code === "userNotFound"
            ) {
              usernameField.setError(translations[errorField.code]);
            } else if (
              errorField.field === "password" &&
              errorField.code === "invalidPassword"
            ) {
              passwordField.setError(translations[errorField.code]);
            }
          });
        }
      } else {
        const data: ResponseMessage = await response.json();
        console.error("Server error:", data.message);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loadingText,
    usernameField,
    passwordField,
    handleSignIn,
  };
};

export default useSignInData;
