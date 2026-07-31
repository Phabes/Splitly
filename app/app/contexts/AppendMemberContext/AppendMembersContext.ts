import { createContext } from "react";

export interface AppendMembersContextType {
  groupID: string;
  selectedUsersData: { _id: string; username: string }[];
  toggleMember: (userObj: { _id: string; username: string }) => void;
}

export const AppendMembersContext =
  createContext<AppendMembersContextType | null>(null);

export default AppendMembersContext;
