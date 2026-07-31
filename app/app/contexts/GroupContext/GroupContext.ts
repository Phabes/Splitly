import { GroupDetailsResult, UserGroupRole } from "@/app/types";
import { createContext } from "react";

export interface GroupContextValue {
  groupID: string;
  groupDetails: GroupDetailsResult | null;
  userRole: UserGroupRole | null;
}

export const GroupContext = createContext<GroupContextValue | undefined>(
  undefined,
);

export default GroupContext;
