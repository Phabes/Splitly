import {
  Button,
  Input,
  LoadingWrapper,
  FormData,
  NavBar,
} from "@/app/components";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSignInData } from "./hooks";

export const SignIn: FC = () => {
  const translations = useTranslations();
  const navigation = useAuthNavigation();
  const { isLoading, loadingText, usernameField, passwordField, handleSignIn } =
    useSignInData();
  const styles = useStyles();

  return (
    <LayoutProvider navbar={<NavBar text={translations["signIn"]} />}>
      <LoadingWrapper
        isLoading={isLoading}
        text={loadingText}
      >
        <View style={styles.inputs}>
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
        </View>
        <View style={styles.buttons}>
          <Button
            text={translations["signIn"]}
            onPress={handleSignIn}
          />
          <Button
            text={translations["signUp"]}
            variant="secondary"
            onPress={() => navigation.replace("SignUp")}
          />
        </View>
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    inputs: { gap: theme.spacing(3) },
    buttons: { gap: theme.spacing(3) },
  });
};

export default SignIn;
