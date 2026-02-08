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

export type AddFriendList = ResponseMessage & {
  users: UserResult[];
  hasMore: boolean;
};

export default function Index() {
  return null;
}
