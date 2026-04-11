import { useContext } from "react";
import { LoadingContext } from "../contexts";

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default useLoadingContext;
