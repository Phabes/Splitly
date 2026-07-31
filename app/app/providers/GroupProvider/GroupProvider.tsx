import { GroupContext, GroupContextValue } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";

type GroupProviderProps = PropsWithChildren & GroupContextValue;

export const GroupProvider: FC<GroupProviderProps> = ({
  groupID,
  groupDetails,
  userRole,
  children,
}) => {
  return (
    <GroupContext value={{ groupID, groupDetails, userRole }}>
      {children}
    </GroupContext>
  );
};

export default GroupProvider;
