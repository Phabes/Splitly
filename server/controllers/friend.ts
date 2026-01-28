import { Response } from "express";
import { AuthRequest } from "middleware/authMiddleware";
import Friend from "models/friend";
import User from "models/user";

export const searchUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    // const { query, page = 1, limit = 10 } = req.query;
    const { query, limit = 10, userIDs = [] } = req.body;
    const currentUserId = req.userId;

    const limitNum = Number(limit);
    const searchQuery = String(query || "");

    const existingFriendships = await Friend.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
      status: { $in: ["accepted", "pending"] },
    });

    const friendshipIds = existingFriendships.map((f) =>
      f.requester!.toString() === currentUserId ? f.recipient : f.requester,
    );

    const baseExclusionsSet = new Set([...friendshipIds, currentUserId]);
    const baseExclusions = Array.from(baseExclusionsSet);

    const fetchExclusionsSet = new Set([...baseExclusions, ...userIDs]);
    const fetchExclusions = Array.from(fetchExclusionsSet);

    const searchMatch = {
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };

    // const skip = userIDs.length > 0 ? 0 : (Number(page) - 1) * limitNum;

    const users = await User.find({
      _id: { $nin: fetchExclusions },
      ...searchMatch,
    })
      .select("id username email")
      .limit(limitNum)
      // .skip(skip)
      .sort({ username: 1 });

    const totalCount = await User.countDocuments({
      _id: { $nin: baseExclusions },
      ...searchMatch,
    });

    return res.status(200).json({
      code: "addFriendListSearchSuccess",
      message: "Users found",
      users,
      hasMore: userIDs.length + users.length < totalCount,
    });
  } catch (err) {
    console.error("Search Users Error:", err);
    return res.status(500).json({
      code: "addFriendListSearchError",
      message: "Server error during search.",
    });
  }
};
