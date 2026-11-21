import mongoose, { HydratedDocument } from "mongoose";
import type { AuthRequest } from "./auth.ts";
import type { AuditFields } from "./common.ts";

export type GroupMemberRole = "owner" | "admin" | "member";
export type EditableGroupRole = Extract<GroupMemberRole, "admin" | "member">;
export type GroupMemberStatus = "pending" | "accepted" | "rejected";
export type GroupRequestDecision = "accepted" | "rejected";

export interface IGroupMember {
  user: mongoose.Types.ObjectId;
  status: GroupMemberStatus;
  role: GroupMemberRole;
}

export interface IGroup extends AuditFields {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  baseCurrency: string;
  icon: string;
  members: IGroupMember[];
}

export type GroupDocument = HydratedDocument<IGroup>;

export type GroupRequest = AuthRequest & {
  group?: GroupDocument;
};

export interface FormattedGroupMember {
  _id: mongoose.Types.ObjectId | string;
  username: string;
  email: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
}

export interface GetGroupListBody {
  query?: string;
  limit?: number;
  groupIDs?: string[];
}

export interface CreateGroupBody {
  name?: string;
  description?: string;
  currency?: string;
  icon?: string;
  members?: string[];
}

export interface SearchGroupRequestsBody {
  limit?: number;
  groupRequestIDs?: string[];
}

export interface DecideGroupRequestBody {
  decision?: GroupRequestDecision;
}

export interface EditGroupDetailsBody {
  name?: string;
  description?: string;
  currency?: string;
  icon?: string;
}

export interface GetGroupInviteCandidatesBody {
  query?: string;
  limit?: number;
  friendIDs?: string[];
  groupID?: string;
}

export interface AddGroupMembersBody {
  members?: string[];
}

export interface UpdateMemberRoleBody {
  newRole?: EditableGroupRole;
}
