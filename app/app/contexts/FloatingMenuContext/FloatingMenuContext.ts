import { createContext } from "react";
import { FloatingMenuConfig } from "@/app/types/floatingMenuConfig";

export interface FloatingMenuContextValue {
  showMenu: (config: FloatingMenuConfig) => void;
  hideMenu: () => void;
}

export const FloatingMenuContext = createContext<
  FloatingMenuContextValue | undefined
>(undefined);

export default FloatingMenuContext;
