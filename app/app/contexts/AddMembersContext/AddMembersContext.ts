import { createContext } from "react";

export interface AddMembersContextType {
  groupID?: string;
  selectedUsersData: { _id: string; username: string }[];
  toggleMember: (userObj: { _id: string; username: string }) => void;
}

export const AddMembersContext = createContext<AddMembersContextType | null>(
  null,
);

export default AddMembersContext;
