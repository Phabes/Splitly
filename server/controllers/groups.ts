import { Response } from "express";
import { AuthRequest } from "@/middleware/authMiddleware.ts";
import Group from "@/models/group.ts";
import { validCurrency } from "@/utils/validCurrency.ts";

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
        role: "admin",
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
    const groupRequestID = req.params.id;
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
