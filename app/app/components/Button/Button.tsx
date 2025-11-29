import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "../Typography";
import { useTheme } from "@/app/hooks";

type ButtonProps = {
  text: string;
  onPress: () => any;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({
  text,
  onPress,
  variant = "primary",
  disabled = false,
}) => {
  const styles = useStyles(variant, disabled);

  const textColor = disabled ? "text-disabled" : "text-primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.5}
      style={[styles.container]}
    >
      <Typography
        text={text}
        color={textColor}
      />
    </TouchableOpacity>
  );
};

const useStyles = (
  variant: ButtonProps["variant"],
  disabled: ButtonProps["disabled"]
) => {
  const theme = useTheme();

  const buttonColor = disabled
    ? "background-disabled"
    : variant === "primary"
    ? "background-primary"
    : "background-app";

  const addBackground = variant === "secondary" && !disabled;

  const borderWidth = addBackground ? theme.spacing(0.5) : 0;

  const borderStyle = addBackground
    ? { borderWidth, borderColor: theme.colors["background-primary"] }
    : {};

  return StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors[buttonColor],
      paddingHorizontal: theme.spacing(4) - borderWidth,
      paddingVertical: theme.spacing(2) - borderWidth,
      borderRadius: theme.spacing(2),
      ...borderStyle,
    },
  });
};

export default Button;
