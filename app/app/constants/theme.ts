import { StyleProp, TextStyle } from "react-native";

export type TypographyKeys =
  | "header-large"
  | "header-medium"
  | "header-small"
  | "body-large"
  | "body-medium"
  | "body-small";

export type ColorKeys =
  | "text-primary"
  | "text-secondary"
  | "text-disabled"
  | "text-error"
  | "text-success"
  | "background-app"
  | "background-primary"
  | "background-secondary"
  | "background-disabled";

const spacing = (num: number) => num * 4;

const typography: Record<TypographyKeys, StyleProp<TextStyle>> = {
  "header-large": {
    fontSize: 24,
    fontWeight: "700",
  },
  "header-medium": {
    fontSize: 22,
    fontWeight: "700",
  },
  "header-small": {
    fontSize: 18,
    fontWeight: "700",
  },
  "body-large": {
    fontSize: 20,
    fontWeight: "400",
  },
  "body-medium": {
    fontSize: 18,
    fontWeight: "400",
  },
  "body-small": {
    fontSize: 16,
    fontWeight: "400",
  },
};

const lightColors: Record<ColorKeys, string> = {
  "text-primary": "#171717",
  "text-secondary": "#737275",
  "text-disabled": "#BDBDBD",
  "text-error": "#E74C3C",
  "text-success": "#1ABC9C",
  "background-app": "#EDf3F7",
  "background-primary": "#8EC4E8",
  "background-secondary": "#60a2cc",
  "background-disabled": "#666666",
};

const darkColors: Record<ColorKeys, string> = {
  "text-primary": "#F4F6F9",
  "text-secondary": "#A9A9C9",
  "text-disabled": "#666666",
  "text-error": "#C0392B",
  "text-success": "#1ABC9C",
  "background-app": "#1D1E30",
  "background-primary": "#2D2D70",
  "background-secondary": "#21214A",
  "background-disabled": "#333333",
};

export type AppTheme = {
  spacing: (num: number) => number;
  typography: Record<TypographyKeys, StyleProp<TextStyle>>;
  colors: Record<ColorKeys, string>;
};

const baseTheme: Omit<AppTheme, "colors"> = {
  spacing: spacing,
  typography: typography,
};

export const lightTheme: AppTheme = {
  ...baseTheme,
  colors: lightColors,
};

export const darkTheme: AppTheme = {
  ...baseTheme,
  colors: darkColors,
};

export default baseTheme;
