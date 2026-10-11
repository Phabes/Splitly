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
  const {
    billData,
    billForm,
    members,
    isLoading,
    setBasicInfo,
    setInvolvedMembers,
    addPositions,
    removePosition,
  } = useCreateBillDetails(groupID);

  return (
    <CreateBillContext.Provider
      value={{
        billData,
        billForm,
        members,
        isLoading,
        setBasicInfo,
        setInvolvedMembers,
        addPositions,
        removePosition,
      }}
    >
      {children}
    </CreateBillContext.Provider>
  );
};

export default CreateBillProvider;
