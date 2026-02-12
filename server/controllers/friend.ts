import { Response } from "express";
import { AuthRequest } from "middleware/authMiddleware";
import Friend from "models/friend";
import User from "models/user";

export const searchUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
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

    const users = await User.find({
      _id: { $nin: fetchExclusions },
      ...searchMatch,
    })
      .select("id username email")
      .limit(limitNum)
      .sort({ username: 1 });

    const totalCount = await User.countDocuments({
      _id: { $nin: baseExclusions },
      ...searchMatch,
    });

    return res.status(200).json({
      code: "searchUsers/addFriendListSearchSuccess",
      message: "Users found",
      users,
      hasMore: userIDs.length + users.length < totalCount,
    });
  } catch (err) {
    return res.status(500).json({
      code: "searchUsers/addFriendListSearchError",
      message: "Server error during search.",
    });
  }
};

export const sendFriendRequest = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const { userToAdd } = req.body;
    const currentUserId = req.userId;

    const existingFriendship = await Friend.findOne({
      $or: [
        { requester: currentUserId, recipient: userToAdd },
        { requester: userToAdd, recipient: currentUserId },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(409).json({
          code: "sendFriendRequest/friendshipAlreadyExists",
          message: "You are already friends with this user.",
        });
      }

      if (existingFriendship.status === "pending") {
        return res.status(409).json({
          code: "sendFriendRequest/friendRequestPending",
          message: "A friend request is already pending.",
        });
      }

      existingFriendship.status = "pending";
      existingFriendship.requester = currentUserId as any;
      existingFriendship.recipient = userToAdd;
      await existingFriendship.save();

      return res.status(200).json({
        code: "sendFriendRequest/requestRenewalSuccess",
        message: "Friend request sent.",
      });
    }

    const newFriendship = new Friend({
      requester: currentUserId,
      recipient: userToAdd,
      status: "pending",
    });

    await newFriendship.save();

    return res.status(200).json({
      code: "sendFriendRequest/requestSuccess",
      message: "Friend request sent.",
    });
  } catch (err) {
    return res.status(500).json({
      code: "sendFriendRequest/requestError",
      message: "Server error during sending request.",
    });
  }
};
