import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useThemeContext } from "@/app/hooks";

export const NotificationIndicator: FC = () => {
  const styles = useStyles();

  return <View style={styles.indicator} />;
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    indicator: {
      backgroundColor: theme.colors["text-error"],
      width: 8,
      aspectRatio: 1,
      borderRadius: 8,
      position: "absolute",
      top: -4,
      right: -2,
    },
  });
};

export default NotificationIndicator;
