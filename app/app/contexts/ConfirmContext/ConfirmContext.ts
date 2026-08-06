import { ConfirmConfig } from "@/app/types";
import { createContext } from "react";

export interface ConfirmContextValue {
  showConfirm: (config: ConfirmConfig) => void;
  hideConfirm: () => void;
}

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined,
);

export default ConfirmContext;
