import { AddMembersContext } from "@/app/contexts";
import { SimpleUser } from "@/app/types";
import { FC, PropsWithChildren } from "react";
import { useAddMembers } from "./hooks";

type AddMembersProviderProps = PropsWithChildren & {
  groupID?: string;
  initialSelectedUsers?: SimpleUser[];
  returnEvent?: string;
};

export const AddMembersProvider: FC<
  PropsWithChildren<AddMembersProviderProps>
> = ({ groupID, initialSelectedUsers = [], returnEvent, children }) => {
  const { selectedUsersData, toggleMember, handleConfirm } = useAddMembers(
    groupID,
    initialSelectedUsers,
    returnEvent,
  );

  return (
    <AddMembersContext.Provider
      value={{
        groupID,
        selectedUsersData,
        toggleMember,
        handleConfirm,
      }}
    >
      {children}
    </AddMembersContext.Provider>
  );
};

export default AddMembersProvider;
