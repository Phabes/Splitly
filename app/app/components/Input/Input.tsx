import { AppTheme } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks";
import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

type InputProps = {
  text: string;
  keyboardType?: "default" | "numeric" | "email-address";
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  variant?: "default" | "error";
  centerText?: boolean;
  disabled?: boolean;
  password?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
};

export const Input: FC<InputProps> = ({
  text,
  keyboardType = "default",
  placeholder = "",
  autoCapitalize = "sentences",
  variant = "default",
  centerText = false,
  disabled = false,
  password = false,
  onChange,
}) => {
  const theme = useTheme();
  const [type, setType] = useState<InputProps["variant"] | "active">(variant);

  const onChangeInput = useCallback(onChange, [onChange]);

  const onFocusInput = useCallback(() => {
    setType("active");
  }, []);

  useEffect(() => {
    setType(variant);
  }, [variant]);

  const styles = useStyles(type, disabled, text, centerText, theme);
  return (
    <TextInput
      placeholder={type === "active" ? "" : placeholder}
      value={text}
      keyboardType={keyboardType}
      onChangeText={onChangeInput}
      onFocus={onFocusInput}
      editable={!disabled}
      secureTextEntry={password}
      autoCapitalize={autoCapitalize}
      style={[styles.input, theme.typography["body-medium"]]}
    />
  );
};

const useStyles = (
  type: InputProps["variant"] | "active",
  disabled: InputProps["disabled"],
  text: InputProps["text"],
  centerText: InputProps["centerText"],
  theme: AppTheme
) => {
  const borderColor =
    type == "default"
      ? "text-secondary"
      : type === "active"
      ? "text-secondary"
      : type === "error"
      ? "text-secondary"
      : "text-secondary";
  const textColor = disabled
    ? "text-disabled"
    : text !== ""
    ? "text-primary"
    : "text-secondary";
  const elevation = !disabled ? 2 : 1;
  const textAlign = centerText ? "center" : "left";

  return StyleSheet.create({
    input: {
      color: theme.colors[textColor],
      borderColor: theme.colors[borderColor],
      borderWidth: 1,
      elevation,
      borderRadius: theme.spacing(2),
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(2),
      backgroundColor: theme.colors["background-primary"],
      textAlign,
    },
  });
};

export default Input;
