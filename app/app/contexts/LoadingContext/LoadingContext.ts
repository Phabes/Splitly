import { createContext } from "react";

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export default LoadingContext;
