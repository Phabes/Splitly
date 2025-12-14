import { useContext } from "react";
import { LanguageContext } from "../contexts";

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguageContext must be used within an LanguageProvider"
    );
  }
  return context;
};

export default useLanguageContext;
