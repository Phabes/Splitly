import { GroupContext, GroupContextValue } from "@/app/contexts";
import { FC, PropsWithChildren } from "react";

type GroupProviderProps = PropsWithChildren & GroupContextValue;

export const GroupProvider: FC<GroupProviderProps> = ({
  groupID,
  groupDetails,
  isAdmin,
  children,
}) => {
  return (
    <GroupContext value={{ groupID, groupDetails, isAdmin }}>
      {children}
    </GroupContext>
  );
};

export default GroupProvider;
