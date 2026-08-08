import { ResponseCodeKeys } from "@/app/constants/responseCodeKeys";
import {
  FriendRequestResult,
  FriendResult,
  GroupDetailsResult,
  GroupMemberResult,
  GroupRequestResult,
  GroupResult,
  UserResult,
} from "./entityResults";

export type ResponseMessage = {
  code: ResponseCodeKeys;
  message: string;
};

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

export type FriendsResponse = ResponseMessage & {
  friends: FriendResult[];
  hasMore: boolean;
  pendingRequestsCount: number;
};

export type FriendRequestsResponse = ResponseMessage & {
  requests: FriendRequestResult[];
  hasMore: boolean;
};

export type GroupsResponse = ResponseMessage & {
  groups: GroupResult[];
  hasMore: boolean;
  pendingRequestsCount: number;
};

export type GroupRequestsResponse = ResponseMessage & {
  requests: GroupRequestResult[];
  hasMore: boolean;
};

export type GroupDetailsResponse = ResponseMessage & {
  groupDetails: GroupDetailsResult;
};

export type EditGroupDetailsResponse = ResponseMessage & {
  groupDetails: Omit<GroupDetailsResult, "members">;
};

export type AddMembersCandidatesResponse = ResponseMessage & {
  friends: FriendResult[];
  hasMore: boolean;
};

export type GroupMembersResponse = ResponseMessage & {
  members: GroupMemberResult[];
};

export default function Index() {
  return null;
}
