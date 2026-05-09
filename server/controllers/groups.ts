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
    const currentUserId = req.userID;
    const limitNum = Number(limit);
    const searchQuery = String(query);

    const baseFilter: any = {
      members: {
        $elemMatch: {
          user: currentUserId,
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

    const groups = await Group.find(fetchFilter)
      .select("id name description")
      .limit(limitNum);
    // .sort({ updatedAt: -1 });

    const totalCount = await Group.countDocuments(baseFilter);

    return res.status(200).json({
      code: "getGroupList/success",
      message: "Groups fetched successfully.",
      groups,
      hasMore: groupIDs.length + groups.length < totalCount,
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
    const { name, description, currency } = req.body;
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

    const newGroup = new Group({
      name: name.trim(),
      description: description ? description.trim() : "",
      baseCurrency: currency.toUpperCase(),
      creator: currentUserID,
      members: [
        {
          user: currentUserID,
          status: "accepted",
          role: "admin",
        },
      ],
    });

    await newGroup.save();

    return res.status(201).json({
      code: "postGroup/success",
      message: "Group created successfully.",
      group: newGroup,
    });
  } catch (error) {
    return res.status(500).json({
      code: "postGroup/error",
      message: "An unexpected error occurred while creating the group.",
    });
  }
};
