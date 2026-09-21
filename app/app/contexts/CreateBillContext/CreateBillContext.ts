import { useFormData } from "@/app/hooks";
import { createContext } from "react";

type FormField = ReturnType<typeof useFormData>;

export interface CreateBillContextValue {
  billForm: {
    billNameField: FormField;
    totalAmountField: FormField;
    currencyField: FormField;
    payerIDField: FormField;
  };
  isLoading: boolean;
}

export const CreateBillContext = createContext<
  CreateBillContextValue | undefined
>(undefined);

export default CreateBillContext;
