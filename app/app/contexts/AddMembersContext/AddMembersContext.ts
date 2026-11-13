import { SimpleUser } from "@/app/types";
import { createContext } from "react";

export interface AddMembersContextValue {
  groupID?: string;
  selectedUsersData: SimpleUser[];
  toggleMember: (userObj: SimpleUser) => void;
  handleConfirm: () => Promise<void>;
}

export const AddMembersContext = createContext<AddMembersContextValue | null>(
  null,
);

export default AddMembersContext;
