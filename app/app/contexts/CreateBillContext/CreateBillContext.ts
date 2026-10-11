import { useFormData } from "@/app/hooks";
import { BillPosition, CreateBillData, UserResult } from "@/app/types";
import { createContext } from "react";

type FormField = ReturnType<typeof useFormData>;

export interface CreateBillContextValue {
  billData: CreateBillData;
  billForm: {
    billNameField: FormField;
    totalAmountField: FormField;
    currencyField: FormField;
    payerIDField: FormField;
  };
  members: UserResult[];
  isLoading: boolean;
  setBasicInfo: (
    name: CreateBillData["name"],
    totalAmount: CreateBillData["totalAmount"],
    currency: CreateBillData["currency"],
    payerID: CreateBillData["payerID"],
  ) => void;
  setInvolvedMembers: (
    newInvolvedMembers: CreateBillData["involvedMembers"],
  ) => void;
  addPositions: (newPositions: BillPosition[]) => void;
  removePosition: (indexToRemove: number) => void;
}

export const CreateBillContext = createContext<
  CreateBillContextValue | undefined
>(undefined);

export default CreateBillContext;
