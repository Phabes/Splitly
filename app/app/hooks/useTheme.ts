import { useMemo } from "react";
import { darkTheme, lightTheme } from "../constants/theme";
import { useColorScheme } from "react-native";

export const useTheme = () => {
  const detectedTheme = useColorScheme();
  const theme = detectedTheme === "light" ? "light" : "dark";

  return useMemo(() => {
    return theme === "dark" ? darkTheme : lightTheme;
  }, [theme]);
};

export default useTheme;
