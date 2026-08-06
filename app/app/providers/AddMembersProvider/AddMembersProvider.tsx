import { AddMembersContext, AddMembersContextType } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";

type AddMembersProviderProps = PropsWithChildren & AddMembersContextType;

export const AddMembersProvider: FC<AddMembersProviderProps> = ({
  groupID,
  selectedUsersData,
  toggleMember,
  children,
}) => {
  return (
    <AddMembersContext.Provider
      value={{ groupID, selectedUsersData, toggleMember }}
    >
      {children}
    </AddMembersContext.Provider>
  );
};

export default AddMembersProvider;
