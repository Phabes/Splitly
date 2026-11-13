import { createContext } from "react";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined,
);

export default LoadingContext;
