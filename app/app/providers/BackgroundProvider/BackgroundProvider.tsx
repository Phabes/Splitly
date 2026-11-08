import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const BackgroundProvider: FC<PropsWithChildren> = ({ children }) => {
  const styles = useStyles();

  return <View style={styles.container}>{children}</View>;
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors["background-app"],
    },
  });
};

export default BackgroundProvider;
