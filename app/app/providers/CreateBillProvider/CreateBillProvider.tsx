import { CreateBillContext } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";
import { useCreateBillDetails } from "./hooks";

type CreateBillProviderProps = PropsWithChildren & {
  groupID: string;
};

export const CreateBillProvider: FC<CreateBillProviderProps> = ({
  children,
  groupID,
}) => {
  const { billData, setBasicInfo, isLoading } = useCreateBillDetails(groupID);

  return (
    <CreateBillContext.Provider value={{ billData, setBasicInfo, isLoading }}>
      {children}
    </CreateBillContext.Provider>
  );
};

export default CreateBillProvider;
