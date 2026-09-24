import { useFormData } from "@/app/hooks";
import { UserResult } from "@/app/types";
import { createContext } from "react";

type FormField = ReturnType<typeof useFormData>;

export interface CreateBillContextValue {
  billForm: {
    billNameField: FormField;
    totalAmountField: FormField;
    currencyField: FormField;
    payerIDField: FormField;
  };
  members: UserResult[];
  isLoading: boolean;
}

export const CreateBillContext = createContext<
  CreateBillContextValue | undefined
>(undefined);

export default CreateBillContext;
