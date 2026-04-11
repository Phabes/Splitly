import { AppTheme } from "@/app/constants/theme";
import { useThemeContext } from "@/app/hooks";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { TogglePassword } from "./components/TogglePassword";
import { InputIcon } from "./components/InputIcon";
import { TouchableOpacity } from "react-native";

type InputProps = {
  text: string;
  onChange: (value: string) => void;
  keyboardType?: "default" | "numeric" | "email-address";
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  variant?: "default" | "error";
  centerText?: boolean;
  disabled?: boolean;
  password?: boolean;
  beginIcon?: IconProp;
};

export const Input: FC<InputProps> = ({
  text,
  onChange,
  keyboardType = "default",
  placeholder = "",
  autoCapitalize = "none",
  variant = "default",
  centerText = false,
  disabled = false,
  password = false,
  beginIcon,
}) => {
  const theme = useThemeContext();

  const inputRef = useRef<TextInput>(null);
  const [type, setType] = useState<InputProps["variant"] | "active">(variant);
  const [passwordShown, setPasswordShown] = useState(password);

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

  const handleIconPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const styles = useStyles(type, disabled, text, centerText, theme);

  return (
    <View style={styles.container}>
      {beginIcon && (
        <TouchableOpacity
          onPress={handleIconPress}
          activeOpacity={1}
        >
          <InputIcon icon={beginIcon} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <TextInput
          ref={inputRef}
          placeholder={type === "active" ? "" : placeholder}
          value={text}
          keyboardType={keyboardType}
          onChangeText={onChangeInput}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          editable={!disabled}
          secureTextEntry={passwordShown}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={theme.colors["text-secondary"]}
          style={[styles.input, theme.typography["body-medium"]]}
        />
      </View>
      {password && (
        <TogglePassword
          status={passwordShown}
          toggleStatus={setPasswordShown}
        />
      )}
    </View>
  );
};

const useStyles = (
  type: InputProps["variant"] | "active",
  disabled: InputProps["disabled"],
  text: InputProps["text"],
  centerText: InputProps["centerText"],
  theme: AppTheme,
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
    container: {
      borderWidth: 1,
      borderRadius: theme.spacing(2),
      borderColor: theme.colors[borderColor],
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(2),
      paddingHorizontal: theme.spacing(4),
    },
    input: {
      color: theme.colors[textColor],
      textAlign,
    },
  });
};

export default Input;
