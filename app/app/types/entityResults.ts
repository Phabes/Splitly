export type UserResult = {
  _id: string;
  username: string;
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

type GroupMemberResult = UserResult & {
  role: string;
  status: string;
};

export type GroupDetailsResult = {
  _id: string;
  name: string;
  description: string;
  baseCurrency: string;
  members: GroupMemberResult[];
};

export default function Index() {
  return null;
}
