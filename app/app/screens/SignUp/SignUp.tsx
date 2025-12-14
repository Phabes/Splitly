import {
  Button,
  Input,
  LoadingWrapper,
  FormData,
  Navbar,
} from "@/app/components";
import { useTheme, useTranslations } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { FC } from "react";
import { useSignUpData } from "./hooks";
import { StyleSheet, View } from "react-native";
import { LayoutProvider } from "@/app/providers";

export const SignUp: FC = () => {
  const translations = useTranslations();
  const styles = useStyles();
  const navigation = useAuthNavigation();
  const {
    isLoading,
    loadingText,
    emailField,
    usernameField,
    passwordField,
    repeatedPasswordField,
    validateSignUp,
  } = useSignUpData();

  return (
    <LoadingWrapper
      isLoading={isLoading}
      text={loadingText}
    >
      <LayoutProvider navbar={<Navbar text={translations["signUp"]} />}>
        <View style={styles.inputs}>
          <FormData
            labelText={translations["email"]}
            messageText={emailField.error}
          >
            <Input
              text={emailField.value}
              placeholder={translations["email"] + "..."}
              keyboardType="email-address"
              onChange={emailField.setValue}
              variant={emailField.error ? "error" : "default"}
            />
          </FormData>
          <FormData
            labelText={translations["username"]}
            messageText={usernameField.error}
          >
            <Input
              text={usernameField.value}
              placeholder={translations["username"] + "..."}
              onChange={usernameField.setValue}
              variant={usernameField.error ? "error" : "default"}
            />
          </FormData>
          <FormData
            labelText={translations["password"]}
            messageText={passwordField.error}
          >
            <Input
              text={passwordField.value}
              placeholder={translations["password"] + "..."}
              password={true}
              onChange={passwordField.setValue}
              variant={passwordField.error ? "error" : "default"}
            />
          </FormData>
          <FormData
            labelText={translations["repeatPassword"]}
            messageText={repeatedPasswordField.error}
          >
            <Input
              text={repeatedPasswordField.value}
              placeholder={translations["repeatPassword"] + "..."}
              password={true}
              onChange={repeatedPasswordField.setValue}
              variant={repeatedPasswordField.error ? "error" : "default"}
            />
          </FormData>
        </View>
        <View style={styles.buttons}>
          <Button
            text={translations["signUp"]}
            onPress={validateSignUp}
          />
          <Button
            text={translations["signIn"]}
            variant="secondary"
            onPress={() => navigation.replace("SignIn")}
          />
        </View>
      </LayoutProvider>
    </LoadingWrapper>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    inputs: { gap: theme.spacing(3) },
    buttons: { gap: theme.spacing(3) },
  });
};

export default SignUp;
