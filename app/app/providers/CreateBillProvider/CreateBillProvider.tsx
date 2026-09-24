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
  const { billForm, members, isLoading } = useCreateBillDetails(groupID);

  return (
    <CreateBillContext.Provider value={{ billForm, members, isLoading }}>
      {children}
    </CreateBillContext.Provider>
  );
};

export default CreateBillProvider;
