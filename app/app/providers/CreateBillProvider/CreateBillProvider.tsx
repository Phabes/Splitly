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
    updateSharedPositions,
  } = useCreateBillDetails(groupID);

  return (
    <CreateBillContext.Provider
      value={{
        groupID,
        billData,
        billForm,
        members,
        isLoading,
        setBasicInfo,
        setInvolvedMembers,
        addPositions,
        removePosition,
        updateSharedPositions,
      }}
    >
      {children}
    </CreateBillContext.Provider>
  );
};

export default CreateBillProvider;
