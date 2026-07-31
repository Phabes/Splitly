import { GroupDetailsResult, UserRole } from "@/app/types";
import { createContext } from "react";

export interface GroupContextValue {
  groupID: string;
  groupDetails: GroupDetailsResult | null;
  userRole: UserRole | null;
}

export const GroupContext = createContext<GroupContextValue | undefined>(
  undefined,
);

export default GroupContext;
