import { CreateBillBasicInfo, CreateBillData } from "@/app/types";
import { createContext } from "react";

export interface CreateBillContextValue {
  billData: CreateBillData;
  setBasicInfo: (basicInfo: CreateBillBasicInfo) => void;
}

export const CreateBillContext = createContext<
  CreateBillContextValue | undefined
>(undefined);

export default CreateBillContext;
