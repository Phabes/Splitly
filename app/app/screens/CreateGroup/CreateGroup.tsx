import { Button, NavBar } from "@/app/components";
import {
  useAppNavigation,
  useAuthContext,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet } from "react-native";

export const CreateGroup: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["createGroup"]}
          onBackPress={navigation.goBack}
          button={
            <Button
              text={translations["signOut"]}
              onPress={signOut}
            />
          }
        />
      }
    ></LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: { flex: 1, gap: theme.spacing(2) },
    footerContainer: {
      alignItems: "center",
    },
  });
};

export default CreateGroup;
