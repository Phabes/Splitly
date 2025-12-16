import { AppTheme } from "@/app/constants/theme";
import { createContext } from "react";

export const ThemeContext = createContext<AppTheme | undefined>(undefined);

export default ThemeContext;
