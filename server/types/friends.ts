import mongoose, { HydratedDocument } from "mongoose";
import type { AuditFields, PopulatedUser } from "./common.ts";

export type FriendshipStatus = "pending" | "accepted" | "rejected" | "blocked";
export type FriendDecision = Extract<FriendshipStatus, "accepted" | "rejected">;

export interface IFriend extends AuditFields {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: FriendshipStatus;
}

export type FriendDocument = HydratedDocument<IFriend>;

export interface PopulatedFriendDoc extends AuditFields {
  _id: mongoose.Types.ObjectId;
  requester: PopulatedUser;
  recipient: PopulatedUser;
  status: FriendshipStatus;
}

export interface FormattedFriend {
  _id: mongoose.Types.ObjectId;
  user: PopulatedUser;
}

export interface SearchFriendSuggestionsBody {
  query?: string;
  limit?: number;
  userIDs?: string[];
}

export interface SendFriendRequestBody {
  userToAddID?: string;
}

export interface SearchFriendRequestsBody {
  limit?: number;
  friendRequestIDs?: string[];
}

export interface DecideFriendRequestBody {
  decision?: FriendDecision;
}

export interface GetFriendListBody {
  query?: string;
  limit?: number;
  friendIDs?: string[];
}
