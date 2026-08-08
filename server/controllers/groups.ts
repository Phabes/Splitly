import { Response } from "express";
import { AuthRequest } from "@/middleware/authMiddleware.ts";
import { validCurrency } from "@/utils/validCurrency.ts";
import Group from "@/models/group.ts";
import User from "@/models/user.ts";
import Friend from "@/models/friend.ts";

export const getGroupList = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { query = "", limit = 10, groupIDs = [] } = req.body;
    const currentUserID = req.userID;
    const limitNum = Number(limit);
    const searchQuery = String(query);

    const baseFilter: any = {
      members: {
        $elemMatch: {
          user: currentUserID,
          status: "accepted",
        },
      },
    };

    if (searchQuery) {
      baseFilter.name = { $regex: searchQuery, $options: "i" };
    }

    const fetchFilter = {
      ...baseFilter,
      _id: { $nin: groupIDs },
    };

    const pendingRequestsFilter = {
      members: {
        $elemMatch: { user: currentUserID, status: "pending" },
      },
    };

    const [groups, totalCount, pendingRequestsCount] = await Promise.all([
      Group.find(fetchFilter).select("id name description").limit(limitNum), //.sort({ updatedAt: -1 }),
      Group.countDocuments(baseFilter),
      Group.countDocuments(pendingRequestsFilter),
    ]);

    return res.status(200).json({
      code: "getGroupList/success",
      message: "Groups fetched successfully.",
      groups,
      hasMore: groupIDs.length + groups.length < totalCount,
      pendingRequestsCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "getGroupList/error",
      message: "Server error during fetching groups.",
    });
  }
};

export const createGroup = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { name, description, currency, members } = req.body;
    const currentUserID = req.userID;

    if (
      !currency ||
      currency.trim().length !== 3 ||
      !validCurrency(currency.toUpperCase())
    ) {
      return res.status(400).json({
        code: "postGroup/invalid-currency",
        message: "A valid 3-letter currency code is required.",
      });
    }
    const groupMembers = [
      {
        user: currentUserID,
        status: "accepted",
        role: "owner",
      },
    ];

    if (Array.isArray(members) && members.length > 0) {
      members.forEach((memberID: string) => {
        if (memberID !== currentUserID?.toString()) {
          groupMembers.push({
            user: memberID,
            status: "pending",
            role: "member",
          });
        }
      });
    }

    const newGroup = new Group({
      name: name.trim(),
      description: description ? description.trim() : "",
      baseCurrency: currency.toUpperCase(),
      creator: currentUserID,
      members: groupMembers,
    });

    await newGroup.save();

    return res.status(201).json({
      code: "postGroup/success",
      message: "Group created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "postGroup/error",
      message: "An unexpected error occurred while creating the group.",
    });
  }
};

export const searchGroupRequests = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { limit = 10, groupRequestIDs = [] } = req.body;
    const currentUserID = req.userID;
    const limitNum = Number(limit);

    const baseFilter = {
      members: {
        $elemMatch: { user: currentUserID, status: "pending" },
      },
    };

    const fetchFilter = {
      ...baseFilter,
      _id: { $nin: groupRequestIDs },
    };

    const requests = await Group.find(fetchFilter)
      .select("id name description")
      .populate("creator", "username email")
      .limit(limitNum);
    // .sort({ createdAt: -1 });

    const totalCount = await Group.countDocuments(baseFilter);

    return res.status(200).json({
      code: "getGroupRequests/success",
      message: "Group requests found.",
      requests,
      hasMore: groupRequestIDs.length + requests.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "getGroupRequests/error",
      message: "Server error during fetching group requests.",
    });
  }
};

export const decideGroupRequest = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { groupRequestID } = req.params;
    const { decision } = req.body;
    const currentUserID = req.userID;

    const group = await Group.findOne({
      _id: groupRequestID,
      members: {
        $elemMatch: { user: currentUserID, status: "pending" },
      },
    });

    if (!group) {
      return res.status(404).json({
        code: "patchGroupRequest/not-found",
        message: "Group request not found or has already been processed.",
      });
    }

    if (decision === "accepted") {
      await Group.updateOne(
        { _id: groupRequestID, "members.user": currentUserID },
        { $set: { "members.$.status": "accepted" } },
      );
    } else {
      await Group.updateOne(
        { _id: groupRequestID },
        { $pull: { members: { user: currentUserID } } },
      );
    }

    return res.status(200).json({
      code: "patchGroupRequest/success",
      message: `Group request has been successfully processed.`,
    });
  } catch (error) {
    return res.status(500).json({
      code: "patchGroupRequest/error",
      message: "Server error while processing group request decision.",
    });
  }
};

export const getGroupDetails = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { groupID } = req.params;

    const group = await Group.findById(groupID)
      .select("name description baseCurrency members")
      .populate("members.user", "username email");

    if (!group) {
      return res.status(404).json({
        code: "getGroupDetails/not-found",
        message: "Group not found.",
      });
    }

    const formattedMembers = group.members.map((member: any) => ({
      _id: member.user._id,
      username: member.user.username,
      email: member.user.email,
      role: member.role,
      status: member.status,
    }));

    return res.status(200).json({
      code: "getGroupDetails/success",
      message: "Group details fetched successfully.",
      groupDetails: {
        _id: groupID,
        name: group.name,
        description: group.description,
        baseCurrency: group.baseCurrency,
        members: formattedMembers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "getGroupDetails/error",
      message: "Server error during fetching group details.",
    });
  }
};

export const editGroupDetails = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { groupID } = req.params;
    const currentUserID = req.userID;
    const { name, description, currency } = req.body;

    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupID,
        members: {
          $elemMatch: { user: currentUserID, role: "owner" },
        },
      },
      {
        $set: {
          name,
          description,
          baseCurrency: currency,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("name description baseCurrency");

    if (!updatedGroup) {
      return res.status(403).json({
        code: "editGroup/forbidden-or-not-found",
        message: "Group not found or you do not have permission to edit it.",
      });
    }

    return res.status(200).json({
      code: "editGroup/success",
      message: "Group updated successfully.",
      groupDetails: {
        _id: groupID,
        name: updatedGroup.name,
        description: updatedGroup.description,
        baseCurrency: updatedGroup.baseCurrency,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "editGroup/error",
      message: "Server error during group update.",
    });
  }
};

export const getGroupInviteCandidates = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { query = "", limit = 10, friendIDs = [], groupID } = req.body;
    const currentUserID = req.userID;
    const limitNum = Number(limit);
    const searchQuery = String(query);

    let groupMemberIDs: string[] = [];

    if (groupID) {
      const group = await Group.findById(groupID).select("members.user");
      if (group) {
        groupMemberIDs = group.members.map((m: any) => m.user.toString());
      }
    }

    const excludedUserIDs = groupMemberIDs.filter(
      (id) => id !== currentUserID?.toString(),
    );

    let userMatchCondition = {};

    if (searchQuery) {
      const matchingUsers = await User.find({
        _id: { $ne: currentUserID, $nin: excludedUserIDs },
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }).select("_id");

      const matchedUserIDs = matchingUsers.map((u) => u._id);

      userMatchCondition = {
        $or: [
          { requester: { $in: matchedUserIDs } },
          { recipient: { $in: matchedUserIDs } },
        ],
      };
    }

    const baseFilter: any = {
      $and: [
        { $or: [{ requester: currentUserID }, { recipient: currentUserID }] },
        { status: "accepted" },
        { requester: { $nin: excludedUserIDs } },
        { recipient: { $nin: excludedUserIDs } },
      ],
    };

    if (searchQuery) {
      baseFilter.$and.push(userMatchCondition);
    }

    const fetchFilter = {
      ...baseFilter,
      _id: { $nin: friendIDs },
    };

    const [friends, totalCount] = await Promise.all([
      Friend.find(fetchFilter)
        .populate("requester", "username email")
        .populate("recipient", "username email")
        .limit(limitNum),
      Friend.countDocuments(baseFilter),
    ]);

    const formattedFriends = friends.map((record: any) => {
      const isRequester =
        record.requester._id.toString() === currentUserID?.toString();
      return {
        _id: record._id,
        user: isRequester ? record.recipient : record.requester,
      };
    });

    return res.status(200).json({
      code: "getAddMembersCandidates/success",
      message: "Candidates fetched successfully.",
      friends: formattedFriends,
      hasMore: friendIDs.length + friends.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "getAddMembersCandidates/error",
      message: "Server error during fetching candidates.",
    });
  }
};

export const addGroupMembers = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { groupID, members } = req.body;
    const currentUserID = req.userID;

    const group = await Group.findById(groupID);
    if (!group) {
      return res.status(404).json({
        code: "addMembers/group-not-found",
        message: "Group not found.",
      });
    }

    const currentMember = group.members.find(
      (m: any) => m.user.toString() === currentUserID?.toString(),
    );

    if (
      !currentMember ||
      (currentMember.role !== "owner" && currentMember.role !== "admin")
    ) {
      return res.status(403).json({
        code: "addMembers/forbidden",
        message: "Only group owner or admins can send invites.",
      });
    }

    let addedOrUpdatedCount = 0;

    members.forEach((userID: string) => {
      const existingMemberIndex = group.members.findIndex(
        (m: any) => m.user.toString() === userID,
      );

      if (existingMemberIndex >= 0) {
        const currentStatus = group.members[existingMemberIndex].status;

        if (currentStatus === "rejected") {
          group.members[existingMemberIndex].status = "pending";
          addedOrUpdatedCount++;
        }
      } else {
        group.members.push({
          user: userID,
          status: "pending",
          role: "member",
        });
        addedOrUpdatedCount++;
      }
    });

    if (addedOrUpdatedCount === 0) {
      return res.status(400).json({
        code: "addMembers/already-invited",
        message:
          "All selected users are already members or have pending invites.",
      });
    }

    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers = group.members.map((member: any) => ({
      _id: member.user._id,
      username: member.user.username,
      email: member.user.email,
      role: member.role,
      status: member.status,
    }));

    return res.status(200).json({
      code: "addMembers/success",
      message: `Successfully sent invites to ${addedOrUpdatedCount} users.`,
      members: formattedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "addMembers/error",
      message: "Server error while sending group requests.",
    });
  }
};

export const removeGroupMember = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { groupID, memberID } = req.params;
    const currentUserID = req.userID;

    const group = await Group.findById(groupID);
    if (!group) {
      return res.status(404).json({
        code: "removeMember/group-not-found",
        message: "Group not found.",
      });
    }

    const currentMember = group.members.find(
      (m: any) => m.user.toString() === currentUserID?.toString(),
    );

    const targetMember = group.members.find(
      (m: any) => m.user.toString() === memberID?.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        code: "removeMember/user-not-found",
        message: "You are not a member of this group.",
      });
    }

    if (!targetMember) {
      await group.populate("members.user", "username email");

      const formattedMembers = group.members.map((member: any) => ({
        _id: member.user._id,
        username: member.user.username,
        email: member.user.email,
        role: member.role,
        status: member.status,
      }));

      return res.status(404).json({
        code: "removeMember/member-not-found",
        message: "User is no longer a member of this group.",
        members: formattedMembers,
      });
    }

    const isSelfLeave = currentUserID?.toString() === memberID?.toString();
    const requesterRole = currentMember.role;
    const targetRole = targetMember.role;

    if (isSelfLeave) {
      if (requesterRole === "owner") {
        return res.status(403).json({
          code: "removeMember/owner-cannot-leave",
          message:
            "Owner cannot leave the group. You must designate a new owner first.",
        });
      }
    } else {
      if (requesterRole === "member") {
        return res.status(403).json({
          code: "removeMember/member-forbidden",
          message: "Members do not have permission to remove users.",
        });
      }

      if (requesterRole === "admin" && targetRole !== "member") {
        return res.status(403).json({
          code: "removeMember/admin-forbidden",
          message: "Admins can only remove regular members.",
        });
      }
    }

    // --- TODO: Future Validations (e.g., unpaid bills) ---
    /*
    const hasUnpaidBills = false; // Replace with actual check
    if (hasUnpaidBills) {
      return res.status(400).json({
        code: "removeMember/unpaid-bills",
        message: "Cannot remove member. They have unsettled balances in this group.",
      });
    }
    */

    group.members.pull(targetMember._id);

    await group.save();

    await group.populate("members.user", "username email");

    const formattedMembers = group.members.map((member: any) => ({
      _id: member.user._id,
      username: member.user.username,
      email: member.user.email,
      role: member.role,
      status: member.status,
    }));

    return res.status(200).json({
      code: "removeMember/success",
      message: isSelfLeave
        ? "Successfully left the group."
        : "Successfully removed the member.",
      members: formattedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      code: "removeMember/error",
      message: "Server error while removing group member.",
    });
  }
};
