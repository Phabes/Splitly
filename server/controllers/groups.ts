import { Response } from "express";
import { validCurrency } from "@/utils/validCurrency.ts";
import mongoose from "mongoose";
import User from "@/models/user.ts";
import Group from "@/models/group.ts";
import {
  AddGroupMembersBody,
  AuthRequest,
  CreateGroupBody,
  DecideGroupRequestBody,
  EditGroupDetailsBody,
  FormattedFriend,
  FormattedGroupMember,
  FriendshipStatus,
  GetGroupInviteCandidatesBody,
  GetGroupListBody,
  GroupDocument,
  GroupMemberRole,
  GroupMemberStatus,
  GroupRequest,
  IGroupMember,
  PopulatedFriendDoc,
  PopulatedUser,
  SearchGroupRequestsBody,
  UpdateMemberRoleBody,
} from "@/types/index.ts";
import Friend from "@/models/friend.ts";

const extractSingleParam = (
  param: string | string[] | undefined,
): string | undefined => (Array.isArray(param) ? param[0] : param);

const formatGroupMembers = (group: GroupDocument): FormattedGroupMember[] =>
  group.members.map((member: IGroupMember): FormattedGroupMember => {
    const user = member.user as unknown as PopulatedUser;

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: member.role,
      status: member.status,
    };
  });

export const getGroupList = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const {
      query = "",
      limit = 10,
      groupIDs = [],
    }: GetGroupListBody = req.body;
    const currentUserID = req.userID!;
    const limitNum: number = Number(limit);
    const searchQuery: string = String(query);

    const baseFilter: Record<string, unknown> = {
      members: {
        $elemMatch: {
          user: currentUserID,
          status: "accepted" satisfies GroupMemberStatus,
        },
      },
    };

    if (searchQuery) {
      baseFilter.name = { $regex: searchQuery, $options: "i" };
    }

    const fetchFilter: Record<string, unknown> = {
      ...baseFilter,
      _id: { $nin: groupIDs },
    };

    const pendingRequestsFilter: Record<string, unknown> = {
      members: {
        $elemMatch: {
          user: currentUserID,
          status: "pending" satisfies GroupMemberStatus,
        },
      },
    };

    const [groups, totalCount, pendingRequestsCount] = await Promise.all([
      Group.find(fetchFilter).select("id name description").limit(limitNum),
      Group.countDocuments(baseFilter),
      Group.countDocuments(pendingRequestsFilter),
    ]);

    return res.status(200).json({
      code: "post/getGroupList/success",
      message: "Groups fetched successfully.",
      groups,
      hasMore: groupIDs.length + groups.length < totalCount,
      pendingRequestsCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/getGroupList/error",
      message: "Server error during fetching groups.",
    });
  }
};

export const createGroup = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description, currency, icon, members }: CreateGroupBody =
      req.body;
    const currentUserID = req.userID!;

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        code: "post/createGroup/invalidName",
        message: "A group name is required.",
      });
    }

    if (
      typeof currency !== "string" ||
      currency.trim().length !== 3 ||
      !validCurrency(currency.toUpperCase())
    ) {
      return res.status(400).json({
        code: "post/createGroup/invalidCurrency",
        message: "A valid 3-letter currency code is required.",
      });
    }

    if (typeof icon !== "string" || icon.trim().length !== 2) {
      return res.status(400).json({
        code: "post/createGroup/invalidIcon",
        message: "A valid 2-letter country code icon is required.",
      });
    }

    const groupMembers: IGroupMember[] = [
      {
        user: new mongoose.Types.ObjectId(currentUserID),
        status: "accepted",
        role: "owner",
      },
    ];

    if (Array.isArray(members) && members.length > 0) {
      members.forEach((memberID: string) => {
        if (
          memberID !== currentUserID &&
          mongoose.Types.ObjectId.isValid(memberID)
        ) {
          groupMembers.push({
            user: new mongoose.Types.ObjectId(memberID),
            status: "pending",
            role: "member",
          });
        }
      });
    }

    const newGroup: GroupDocument = new Group({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      creator: new mongoose.Types.ObjectId(currentUserID),
      baseCurrency: currency.toUpperCase(),
      icon: icon.toUpperCase(),
      members: groupMembers,
    });

    await newGroup.save();

    return res.status(201).json({
      code: "post/createGroup/success",
      message: "Group created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/createGroup/error",
      message: "An unexpected error occurred while creating the group.",
    });
  }
};

export const searchGroupRequests = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { limit = 10, groupRequestIDs = [] }: SearchGroupRequestsBody =
      req.body;
    const currentUserID = req.userID!;
    const limitNum: number = Number(limit);

    const baseFilter: Record<string, unknown> = {
      members: {
        $elemMatch: {
          user: currentUserID,
          status: "pending" satisfies GroupMemberStatus,
        },
      },
    };

    const fetchFilter: Record<string, unknown> = {
      ...baseFilter,
      _id: { $nin: groupRequestIDs },
    };

    const requests = await Group.find(fetchFilter)
      .select("id name description")
      .populate<{ creator: PopulatedUser }>("creator", "username email")
      .limit(limitNum);

    const totalCount: number = await Group.countDocuments(baseFilter);

    return res.status(200).json({
      code: "post/searchGroupRequests/success",
      message: "Group requests found.",
      requests,
      hasMore: groupRequestIDs.length + requests.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/searchGroupRequests/error",
      message: "Server error during fetching group requests.",
    });
  }
};

export const decideGroupRequest = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const groupRequestID: string | undefined = extractSingleParam(
      req.params.groupRequestID,
    );
    const { decision }: DecideGroupRequestBody = req.body;
    const currentUserID = req.userID!;

    if (!groupRequestID || !mongoose.Types.ObjectId.isValid(groupRequestID)) {
      return res.status(400).json({
        code: "patch/decideGroupRequest/invalidID",
        message: "Valid group request ID is required.",
      });
    }

    if (decision !== "accepted" && decision !== "rejected") {
      return res.status(400).json({
        code: "patch/decideGroupRequest/invalidDecision",
        message: "Decision must be 'accepted' or 'rejected'.",
      });
    }

    const group = await Group.findOne({
      _id: groupRequestID,
      members: {
        $elemMatch: {
          user: currentUserID,
          status: "pending" satisfies GroupMemberStatus,
        },
      },
    });

    if (!group) {
      return res.status(404).json({
        code: "patch/decideGroupRequest/notFound",
        message: "Group request not found or has already been processed.",
      });
    }

    if (decision === "accepted") {
      await Group.updateOne(
        { _id: groupRequestID, "members.user": currentUserID },
        {
          $set: {
            "members.$.status": "accepted" satisfies GroupMemberStatus,
          },
        },
      );
    } else {
      await Group.updateOne(
        { _id: groupRequestID },
        { $pull: { members: { user: currentUserID } } },
      );
    }

    return res.status(200).json({
      code: "patch/decideGroupRequest/success",
      message: "Group request has been successfully processed.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "patch/decideGroupRequest/error",
      message: "Server error while processing group request decision.",
    });
  }
};

export const getGroupDetails = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const group: GroupDocument = req.group!;

    await group.populate("members.user", "username email");

    const formattedMembers: FormattedGroupMember[] = formatGroupMembers(group);

    return res.status(200).json({
      code: "get/getGroupDetails/success",
      message: "Group details fetched successfully.",
      groupDetails: {
        _id: group._id,
        name: group.name,
        description: group.description,
        baseCurrency: group.baseCurrency,
        icon: group.icon,
        members: formattedMembers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "get/getGroupDetails/error",
      message: "Server error during fetching group details.",
    });
  }
};

export const editGroupDetails = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description, currency, icon }: EditGroupDetailsBody =
      req.body;
    const group: GroupDocument = req.group!;

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          code: "patch/editGroupDetails/invalidName",
          message: "Group name cannot be empty.",
        });
      }
      group.name = name.trim();
    }

    if (description !== undefined) {
      group.description =
        typeof description === "string" ? description.trim() : "";
    }

    if (currency !== undefined) {
      if (
        typeof currency !== "string" ||
        currency.trim().length !== 3 ||
        !validCurrency(currency.toUpperCase())
      ) {
        return res.status(400).json({
          code: "patch/editGroupDetails/invalidCurrency",
          message: "A valid 3-letter currency code is required.",
        });
      }

      group.baseCurrency = currency.toUpperCase();
    }

    if (icon !== undefined) {
      if (typeof icon !== "string" || icon.trim().length !== 2) {
        return res.status(400).json({
          code: "patch/editGroupDetails/invalidIcon",
          message: "A valid 2-letter country code icon is required.",
        });
      }

      group.icon = icon.toUpperCase();
    }

    await group.save();

    return res.status(200).json({
      code: "patch/editGroupDetails/success",
      message: "Group updated successfully.",
      groupDetails: {
        _id: group._id,
        name: group.name,
        description: group.description,
        baseCurrency: group.baseCurrency,
        icon: group.icon,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "patch/editGroupDetails/error",
      message: "Server error during group update.",
    });
  }
};

export const getGroupInviteCandidates = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const {
      query = "",
      limit = 10,
      friendIDs = [],
      groupID,
    }: GetGroupInviteCandidatesBody = req.body;
    const currentUserID = req.userID!;
    const limitNum: number = Number(limit);
    const searchQuery: string = String(query);

    let groupMemberIDs: string[] = [];

    if (groupID) {
      const group = await Group.findById(groupID).select("members");

      if (group) {
        const isMember: boolean = group.members.some(
          (m: IGroupMember) => m.user.toString() === currentUserID,
        );

        if (!isMember) {
          return res.status(403).json({
            code: "post/getGroupInviteCandidates/accessDenied",
            message: "You do not have permission to view this group's data.",
          });
        }

        groupMemberIDs = group.members.map((m: IGroupMember) =>
          m.user.toString(),
        );
      }
    }

    const excludedUserIDs: string[] = groupMemberIDs.filter(
      (id: string) => id !== currentUserID,
    );

    let userMatchCondition: Record<string, unknown> = {};

    if (searchQuery) {
      const matchingUsers = await User.find({
        _id: { $ne: currentUserID, $nin: excludedUserIDs },
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }).select("_id");

      const matchedUserIDs: mongoose.Types.ObjectId[] = matchingUsers.map(
        (u) => u._id,
      );

      userMatchCondition = {
        $or: [
          { requester: { $in: matchedUserIDs } },
          { recipient: { $in: matchedUserIDs } },
        ],
      };
    }

    const andConditions: Record<string, unknown>[] = [
      { $or: [{ requester: currentUserID }, { recipient: currentUserID }] },
      { status: "accepted" satisfies FriendshipStatus },
      { requester: { $nin: excludedUserIDs } },
      { recipient: { $nin: excludedUserIDs } },
    ];

    if (searchQuery) {
      andConditions.push(userMatchCondition);
    }

    const baseFilter: Record<string, unknown> = {
      $and: andConditions,
    };

    const fetchFilter: Record<string, unknown> = {
      ...baseFilter,
      _id: { $nin: friendIDs },
    };

    const [friends, totalCount]: [PopulatedFriendDoc[], number] =
      await Promise.all([
        Friend.find<PopulatedFriendDoc>(fetchFilter)
          .populate("requester", "username email")
          .populate("recipient", "username email")
          .limit(limitNum)
          .lean<PopulatedFriendDoc[]>(),
        Friend.countDocuments(baseFilter),
      ]);

    const formattedFriends: FormattedFriend[] = friends.map((record) => {
      const isRequester: boolean =
        record.requester._id.toString() === currentUserID;

      return {
        _id: record._id,
        user: isRequester ? record.recipient : record.requester,
      };
    });

    return res.status(200).json({
      code: "post/getGroupInviteCandidates/success",
      message: "Candidates fetched successfully.",
      friends: formattedFriends,
      hasMore: friendIDs.length + friends.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/getGroupInviteCandidates/error",
      message: "Server error during fetching candidates.",
    });
  }
};

export const addGroupMembers = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { members }: AddGroupMembersBody = req.body;
    const group: GroupDocument = req.group!;

    if (!Array.isArray(members)) {
      return res.status(400).json({
        code: "post/addGroupMembers/invalidMembers",
        message: "Members must be provided as an array of user IDs.",
      });
    }

    let addedOrUpdatedCount: number = 0;

    members.forEach((userID: string) => {
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        return;
      }

      const existingMemberIndex: number = group.members.findIndex(
        (m: IGroupMember) => m.user.toString() === userID,
      );

      if (existingMemberIndex >= 0) {
        const currentStatus: GroupMemberStatus =
          group.members[existingMemberIndex].status;

        if (currentStatus === "rejected") {
          group.members[existingMemberIndex].status = "pending";
          addedOrUpdatedCount++;
        }
      } else {
        group.members.push({
          user: new mongoose.Types.ObjectId(userID),
          status: "pending",
          role: "member",
        });
        addedOrUpdatedCount++;
      }
    });

    if (addedOrUpdatedCount === 0) {
      return res.status(400).json({
        code: "post/addGroupMembers/alreadyInvited",
        message:
          "All selected users are already members or have pending invites.",
      });
    }

    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers: FormattedGroupMember[] = formatGroupMembers(group);

    return res.status(200).json({
      code: "post/addGroupMembers/success",
      message: `Successfully sent invites to ${addedOrUpdatedCount} users.`,
      members: formattedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/addGroupMembers/error",
      message: "Server error while sending group requests.",
    });
  }
};

export const removeGroupMember = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const memberID: string | undefined = extractSingleParam(
      req.params.memberID,
    );
    const currentUserID = req.userID!;
    const group: GroupDocument = req.group!;

    const currentMember: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === currentUserID,
    );

    const targetMember: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === memberID,
    );

    if (!targetMember) {
      await group.populate("members.user", "username email");

      const formattedMembers: FormattedGroupMember[] =
        formatGroupMembers(group);

      return res.status(404).json({
        code: "delete/removeGroupMember/memberNotFound",
        message: "User is no longer a member of this group.",
        members: formattedMembers,
      });
    }

    const isSelfLeave: boolean = currentUserID === memberID;
    const requesterRole: GroupMemberRole | undefined = currentMember?.role;
    const targetRole: GroupMemberRole = targetMember.role;

    if (isSelfLeave) {
      if (requesterRole === "owner" && group.members.length > 1) {
        return res.status(403).json({
          code: "delete/removeGroupMember/ownerCannotLeave",
          message:
            "Owner cannot leave the group. You must designate a new owner first.",
        });
      }
    } else {
      if (requesterRole === "member") {
        return res.status(403).json({
          code: "delete/removeGroupMember/memberForbidden",
          message: "Members do not have permission to remove users.",
        });
      }

      if (requesterRole === "admin" && targetRole !== "member") {
        return res.status(403).json({
          code: "delete/removeGroupMember/adminForbidden",
          message: "Admins can only remove regular members.",
        });
      }
    }

    group.members = group.members.filter(
      (m: IGroupMember) => m.user.toString() !== targetMember.user.toString(),
    );

    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers: FormattedGroupMember[] = formatGroupMembers(group);

    return res.status(200).json({
      code: "delete/removeGroupMember/success",
      message: isSelfLeave
        ? "Successfully left the group."
        : "Successfully removed the member.",
      members: formattedMembers,
      isSelfLeave,
    });
  } catch (error) {
    return res.status(500).json({
      code: "delete/removeGroupMember/error",
      message: "Server error while removing group member.",
    });
  }
};

export const updateMemberRole = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const memberID: string | undefined = extractSingleParam(
      req.params.memberID,
    );
    const { newRole }: UpdateMemberRoleBody = req.body;
    const currentUserID = req.userID!;
    const group: GroupDocument = req.group!;

    if (newRole !== "admin" && newRole !== "member") {
      return res.status(400).json({
        code: "patch/updateMemberRole/invalidRole",
        message: "Invalid role specified.",
      });
    }

    const currentMember: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === currentUserID,
    );

    const targetMember: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === memberID,
    );

    if (!targetMember) {
      await group.populate("members.user", "username email");

      const formattedMembers: FormattedGroupMember[] =
        formatGroupMembers(group);

      return res.status(404).json({
        code: "patch/updateMemberRole/memberNotFound",
        message: "User is no longer a member of this group.",
        members: formattedMembers,
      });
    }

    const requesterRole: GroupMemberRole | undefined = currentMember?.role;
    const targetRole: GroupMemberRole = targetMember.role;

    if (targetRole === "owner") {
      return res.status(403).json({
        code: "patch/updateMemberRole/ownerProtected",
        message:
          "Owner role cannot be modified through this action. Use 'Transfer Ownership' instead.",
      });
    }

    if (requesterRole === "admin" && targetRole === "admin") {
      return res.status(403).json({
        code: "patch/updateMemberRole/adminForbidden",
        message:
          "Admins can only promote members to admins. Only the Owner can revoke admin rights.",
      });
    }

    targetMember.role = newRole;
    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers: FormattedGroupMember[] = formatGroupMembers(group);

    return res.status(200).json({
      code: "patch/updateMemberRole/success",
      message: `Successfully changed role to '${newRole}'.`,
      members: formattedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "patch/updateMemberRole/error",
      message: "Server error while updating role.",
    });
  }
};

export const transferOwnership = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const memberID: string | undefined = extractSingleParam(
      req.params.memberID,
    );
    const currentUserID = req.userID!;
    const group: GroupDocument = req.group!;

    const currentOwner: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === currentUserID,
    );

    const targetMember: IGroupMember | undefined = group.members.find(
      (m: IGroupMember) => m.user.toString() === memberID,
    );

    if (!targetMember) {
      await group.populate("members.user", "username email");

      const formattedMembers: FormattedGroupMember[] =
        formatGroupMembers(group);

      return res.status(404).json({
        code: "patch/transferOwnership/memberNotFound",
        message: "User is no longer a member of this group.",
        members: formattedMembers,
      });
    }

    if (
      currentOwner &&
      currentOwner.user.toString() === targetMember.user.toString()
    ) {
      return res.status(400).json({
        code: "patch/transferOwnership/alreadyOwner",
        message: "You are already the owner of this group.",
      });
    }

    if (currentOwner) {
      currentOwner.role = "admin";
    }
    targetMember.role = "owner";

    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers: FormattedGroupMember[] = formatGroupMembers(group);

    return res.status(200).json({
      code: "patch/transferOwnership/success",
      message: "Ownership successfully transferred.",
      members: formattedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "patch/transferOwnership/error",
      message: "Server error while transferring ownership.",
    });
  }
};

export const getCreateBillDetails = async (
  req: GroupRequest,
  res: Response,
): Promise<Response> => {
  try {
    const group: GroupDocument = req.group!;

    await group.populate("members.user", "username email");

    const cleanMembers = group.members.map((member: IGroupMember) => {
      const user = member.user as unknown as PopulatedUser;

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
    });

    return res.status(200).json({
      code: "get/getCreateBillDetails/success",
      message: "Bill details retrieved.",
      baseCurrency: group.baseCurrency,
      members: cleanMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "get/getCreateBillDetails/error",
      message: "Server error while getting create bill details.",
    });
  }
};
