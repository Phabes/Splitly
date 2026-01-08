import { AppTheme } from "@/app/constants/theme";
import { useThemeContext } from "@/app/hooks";
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
  autoCapitalize = "none",
  variant = "default",
  centerText = false,
  disabled = false,
  password = false,
  onChange,
}) => {
  const theme = useThemeContext();
  const [type, setType] = useState<InputProps["variant"] | "active">(variant);

  const onChangeInput = useCallback(onChange, [onChange]);

  const onFocusInput = useCallback(() => {
    setType("active");
  }, []);

  const onBlurInput = useCallback(() => {
    setType("default");
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
      onBlur={onBlurInput}
      editable={!disabled}
      secureTextEntry={password}
      autoCapitalize={autoCapitalize}
      placeholderTextColor={theme.colors["text-secondary"]}
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
    type === "default"
      ? "text-secondary"
      : type === "active"
      ? "text-success"
      : type === "error"
      ? "text-error"
      : "text-secondary";
  const textColor = disabled
    ? "text-disabled"
    : text !== ""
    ? "text-primary"
    : "text-secondary";
  const textAlign = centerText ? "center" : "left";

  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: theme.spacing(2),
      borderColor: theme.colors[borderColor],
      color: theme.colors[textColor],
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(2),
      textAlign,
    },
  });
};

export default Input;
