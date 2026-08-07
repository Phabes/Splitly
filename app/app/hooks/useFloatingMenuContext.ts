import { useContext } from "react";
import { FloatingMenuContext } from "../contexts/FloatingMenuContext/FloatingMenuContext";

export const useFloatingMenuContext = () => {
  const context = useContext(FloatingMenuContext);
  if (!context) {
    throw new Error(
      "useFloatingMenuContext must be used within FloatingMenuProvider",
    );
  }
  return context;
};

export default useFloatingMenuContext;
