import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";
import { ColorKeys } from "@/app/constants/theme";
import { IconKeys } from "@/app/constants/iconKeys";
import { Icon } from "../Icon";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: IconKeys;
  iconPosition?: "left" | "right";
};

export const Button: FC<ButtonProps> = ({
  text,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
}) => {
  const styles = useStyles(variant, disabled, fullWidth);

  const contentColor = disabled ? "text-disabled" : "text-primary";

  const iconElement = icon ? (
    <Icon
      icon={icon}
      color={contentColor}
      size="small"
    />
  ) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.5}
      style={styles.container}
    >
      {iconPosition === "left" && iconElement}
      <Typography
        text={text}
        color={contentColor}
      />
      {iconPosition === "right" && iconElement}
    </TouchableOpacity>
  );
};

const useStyles = (
  variant: ButtonProps["variant"],
  disabled: ButtonProps["disabled"],
  fullWidth: ButtonProps["fullWidth"],
) => {
  const theme = useThemeContext();

  const buttonColor: ColorKeys = disabled
    ? "background-disabled"
    : variant === "primary"
      ? "background-primary"
      : variant === "secondary"
        ? "background-secondary"
        : "text-error";

  const addBackground = variant === "secondary" && !disabled;

  const borderWidth = addBackground ? theme.spacing(0.5) : 0;

  const borderStyle = addBackground
    ? { borderWidth, borderColor: theme.colors["background-primary"] }
    : {};

  const widthStyle = fullWidth ? { flex: 1 } : {};

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing(2),
      backgroundColor: theme.colors[buttonColor],
      paddingHorizontal: theme.spacing(4) - borderWidth,
      paddingVertical: theme.spacing(2) - borderWidth,
      borderRadius: theme.spacing(2),
      ...borderStyle,
      ...widthStyle,
    },
  });
};

export default Button;
