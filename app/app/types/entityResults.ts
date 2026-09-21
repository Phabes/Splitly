import { CountryKeys } from "../constants/countries";

export type UserGroupRole = "owner" | "admin" | "member";

export type UserGroupStatus = "accepted" | "pending";

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type SimpleUser = {
  _id: string;
  username: string;
};

export type UserResult = SimpleUser & {
  email: string;
};

export type FriendResult = {
  _id: string;
  user: UserResult;
};

export type FriendRequestResult = {
  _id: string;
  requester: UserResult;
};

export type GroupResult = {
  _id: string;
  name: string;
  description: string;
};

export type GroupRequestResult = GroupResult & {
  creator: UserResult;
};

export type GroupMemberResult = UserResult & {
  role: UserGroupRole;
  status: UserGroupStatus;
};

export type GroupDetailsResult = {
  _id: string;
  name: string;
  description: string;
  baseCurrency: string;
  icon: CountryKeys;
  members: GroupMemberResult[];
};

export type CreateBillData = {
  name: string;
  totalAmount: number;
  currency: Currency["code"];
  payerID: string;
  involvedMembers: Array<{
    userID: string;
    status: string;
  }>;
  positions: Array<{
    name: string;
    unitPrice: number;
    quantity: number;
    isSharedByAll: boolean;
  }>;
};

export default function Index() {
  return null;
}
