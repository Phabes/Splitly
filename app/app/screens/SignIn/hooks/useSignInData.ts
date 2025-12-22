import { useAuthContext, useFormData, useTranslations } from "@/app/hooks";
import { signInCall } from "@/app/services";
import { ResponseMessage } from "@/app/types";
import { validatePassword, validateUsername } from "@/app/utils";
import { useState } from "react";

type SignInResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
};

type SignInFailResponse = ResponseMessage & {
  errorFields: Array<{
    field: "username" | "password";
    code: "userNotFound" | "invalidPassword";
    message: string;
  }>;
};

export const useSignInData = () => {
  const { signIn } = useAuthContext();
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
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    clearAllErrors();
    // validateSignIn();
    try {
      const response = await signInCall(
        usernameField.value,
        passwordField.value
      );

      if (response.ok) {
        const data: SignInResponse = await response.json();
        await signIn(data.userToken, data.refreshToken);
      } else if (response.status === 400) {
        const data: SignInFailResponse = await response.json();
        if (data.code === "fieldsValidationError") {
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
