import { ResponseCodeKeys } from "../constants/responseCodeKeys";

export type ResponseMessage = {
  code: ResponseCodeKeys;
  message: string;
};

export interface UserResult {
  _id: string;
  username: string;
  email: string;
}

export type VerifyUserResponse = ResponseMessage & {
  user: UserResult;
};

export type RefreshUserResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
  user: UserResult;
};

export type SignInResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
  user: UserResult;
};

export type SignInFailResponse = ResponseMessage & {
  errorFields: Array<{
    field: "username" | "password";
    code: "userNotFound" | "invalidPassword";
    message: string;
  }>;
};

export type AddFriendResponse = ResponseMessage & {
  users: UserResult[];
  hasMore: boolean;
};

export type FriendResult = {
  _id: string;
  user: UserResult;
};

export type FriendsResponse = ResponseMessage & {
  friends: FriendResult[];
  hasMore: boolean;
  pendingRequestsCount: number;
};

export interface FriendRequestResult {
  _id: string;
  requester: UserResult;
}

export type FriendRequestsResponse = ResponseMessage & {
  requests: FriendRequestResult[];
  hasMore: boolean;
};

export type GroupResult = {
  _id: string;
  name: string;
  description: string;
};

export type GroupsResponse = ResponseMessage & {
  groups: GroupResult[];
  hasMore: boolean;
  pendingRequestsCount: number;
};

export type GroupRequestResult = GroupResult & {
  creator: UserResult;
};

export type GroupRequestsResponse = ResponseMessage & {
  requests: GroupRequestResult[];
  hasMore: boolean;
};

export default function Index() {
  return null;
}
