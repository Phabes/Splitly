import { GroupContext, GroupContextValue } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";

type GroupProviderProps = PropsWithChildren & GroupContextValue;

export const GroupProvider: FC<GroupProviderProps> = ({
  groupID,
  groupDetails,
  userRole,
  setGroupMembers,
  children,
}) => {
  return (
    <GroupContext.Provider
      value={{ groupID, groupDetails, userRole, setGroupMembers }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
