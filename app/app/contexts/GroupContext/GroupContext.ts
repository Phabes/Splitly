import {
  GroupDetailsResult,
  GroupMemberResult,
  UserGroupRole,
} from "@/app/types";
import { createContext } from "react";

export interface GroupContextValue {
  groupID: string;
  groupDetails: GroupDetailsResult | null;
  userRole: UserGroupRole | null;
  setGroupMembers: (newMembers: GroupMemberResult[]) => void;
}

export const GroupContext = createContext<GroupContextValue | undefined>(
  undefined,
);

export default GroupContext;
