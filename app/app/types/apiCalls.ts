import { ResponseCodeKeys } from "../constants/responseCodeKeys";

export type ResponseMessage = {
  code: ResponseCodeKeys;
  message: string;
};

export type SignInResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
};

export type SignInFailResponse = ResponseMessage & {
  errorFields: Array<{
    field: "username" | "password";
    code: "userNotFound" | "invalidPassword";
    message: string;
  }>;
};

export interface UserResult {
  _id: string;
  username: string;
  email: string;
}

export type AddFriendResponse = ResponseMessage & {
  users: UserResult[];
  hasMore: boolean;
};

export interface FriendRequestResult {
  _id: string;
  requester: UserResult;
}

export type FriendRequestsResponse = ResponseMessage & {
  requests: FriendRequestResult[];
  hasMore: boolean;
};

export default function Index() {
  return null;
}
