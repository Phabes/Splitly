import { SimpleUser } from "@/app/types";
import { createContext } from "react";

export interface AddMembersContextType {
  groupID?: string;
  selectedUsersData: SimpleUser[];
  toggleMember: (userObj: SimpleUser) => void;
}

export const AddMembersContext = createContext<AddMembersContextType | null>(
  null,
);

export default AddMembersContext;
