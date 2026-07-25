import { AppendMembersContext, AppendMembersContextType } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";

type AppendMembersProviderProps = PropsWithChildren & AppendMembersContextType;

export const AppendMembersProvider: FC<AppendMembersProviderProps> = ({
  groupID,
  selectedUsersData,
  toggleMember,
  children,
}) => {
  return (
    <AppendMembersContext value={{ groupID, selectedUsersData, toggleMember }}>
      {children}
    </AppendMembersContext>
  );
};

export default AppendMembersProvider;
