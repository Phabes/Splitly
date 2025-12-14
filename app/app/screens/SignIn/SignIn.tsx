import { Button, LoadingWrapper, Navbar } from "@/app/components";
import { useTheme, useTranslations } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

export const SignIn: FC = () => {
  const translations = useTranslations();
  const styles = useStyles();
  const navigation = useAuthNavigation();

  return (
    <LoadingWrapper isLoading={false}>
      <LayoutProvider navbar={<Navbar text={translations["signIn"]} />}>
        <View style={styles.inputs}></View>
        <View style={styles.buttons}>
          <Button
            text={translations["signIn"]}
            onPress={() => {}}
          />
          <Button
            text={translations["signUp"]}
            variant="secondary"
            onPress={() => navigation.replace("SignUp")}
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

export default SignIn;
