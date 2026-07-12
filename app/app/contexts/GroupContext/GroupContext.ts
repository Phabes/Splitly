import { GroupDetailsResult } from "@/app/types";
import { createContext } from "react";

export interface GroupContextValue {
  groupID: string;
  groupDetails: GroupDetailsResult | null;
  isAdmin: boolean;
}

export const GroupContext = createContext<GroupContextValue | undefined>(
  undefined,
);

export default GroupContext;
