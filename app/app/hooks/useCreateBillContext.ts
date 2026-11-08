import { useContext } from "react";
import { CreateBillContext } from "../contexts";

export const useCreateBillContext = () => {
  const context = useContext(CreateBillContext);
  if (!context) {
    throw new Error(
      "useCreateBillContext must be used within CreateBillProvider",
    );
  }
  return context;
};

export default useCreateBillContext;
