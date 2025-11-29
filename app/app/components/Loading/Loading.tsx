import { ColorKeys } from "@/app/constants/theme";
import { FC } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Typography } from "../Typography";
import { useTheme } from "@/app/hooks";

type LoadingProps = {
  size?: "small" | "large";
  color?: ColorKeys;
  text?: string;
};

export const Loading: FC<LoadingProps> = ({
  size = "large",
  color = "text-success",
  text,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={theme.colors[color]}
      />
      {text && (
        <Typography
          text={text}
          color={color}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
