import { FC, PropsWithChildren, useMemo } from "react";
import { useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "@/app/constants/theme";
import { ThemeContext } from "@/app/contexts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemeProviderProps = PropsWithChildren;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  const systemTheme = useColorScheme();
  const activeMode = systemTheme === "light" ? "light" : "dark";

  const theme = useMemo(() => {
    return activeMode === "dark" ? darkTheme : lightTheme;
  }, [activeMode]);

  return (
    <ThemeContext.Provider value={theme}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors["background-app"],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
