import { useContext } from "react";
import { ConfirmContext } from "../contexts";

export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirmContext must be used within ConfirmProvider");
  }
  return context;
};

export default useConfirmContext;
