import { Response } from "express";
import mongoose from "mongoose";
import User from "@/models/user.ts";
import Friend from "@/models/friend.ts";
import {
  AuthRequest,
  DecideFriendRequestBody,
  FormattedFriend,
  FriendshipStatus,
  GetFriendListBody,
  PopulatedFriendDoc,
  PopulatedUser,
  SearchFriendRequestsBody,
  SearchFriendSuggestionsBody,
  SendFriendRequestBody,
} from "@/types/index.ts";

export const searchFriendSuggestions = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const {
      query = "",
      limit = 10,
      userIDs = [],
    }: SearchFriendSuggestionsBody = req.body;
    const currentUserID = req.userID!;

    const limitNum: number = Number(limit);
    const searchQuery: string = String(query);

    const existingFriendships = await Friend.find({
      $or: [{ requester: currentUserID }, { recipient: currentUserID }],
      status: { $in: ["accepted", "pending"] satisfies FriendshipStatus[] },
    });

    const friendshipIDs: string[] = existingFriendships.map((f) =>
      f.requester.toString() === currentUserID
        ? f.recipient.toString()
        : f.requester.toString(),
    );

    const baseExclusionsSet = new Set<string>([
      ...friendshipIDs,
      currentUserID,
    ]);
    const baseExclusions: string[] = Array.from(baseExclusionsSet);

    const fetchExclusionsSet = new Set<string>([...baseExclusions, ...userIDs]);
    const fetchExclusions: string[] = Array.from(fetchExclusionsSet);

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

    const totalCount: number = await User.countDocuments({
      _id: { $nin: baseExclusions },
      ...searchMatch,
    });

    return res.status(200).json({
      code: "post/searchFriendSuggestions/success",
      message: "Users found.",
      users,
      hasMore: userIDs.length + users.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/searchFriendSuggestions/error",
      message: "Server error during search.",
    });
  }
};

export const sendFriendRequest = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { userToAddID }: SendFriendRequestBody = req.body;
    const currentUserID = req.userID!;

    if (!userToAddID || !mongoose.Types.ObjectId.isValid(userToAddID)) {
      return res.status(400).json({
        code: "post/sendFriendRequest/invalidUserID",
        message: "Valid userToAddID is required.",
      });
    }

    if (userToAddID === currentUserID) {
      return res.status(400).json({
        code: "post/sendFriendRequest/selfRequest",
        message: "You cannot send a friend request to yourself.",
      });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        { requester: currentUserID, recipient: userToAddID },
        { requester: userToAddID, recipient: currentUserID },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(409).json({
          code: "post/sendFriendRequest/friendshipAlreadyExists",
          message: "You are already friends with this user.",
        });
      }

      if (existingFriendship.status === "pending") {
        return res.status(409).json({
          code: "post/sendFriendRequest/friendRequestPending",
          message: "A friend request is already pending.",
        });
      }

      existingFriendship.status = "pending";
      existingFriendship.requester = new mongoose.Types.ObjectId(currentUserID);
      existingFriendship.recipient = new mongoose.Types.ObjectId(userToAddID);
      await existingFriendship.save();

      return res.status(200).json({
        code: "post/sendFriendRequest/requestRenewalSuccess",
        message: "Friend request sent.",
      });
    }

    const newFriendship = new Friend({
      requester: currentUserID,
      recipient: userToAddID,
      status: "pending" satisfies FriendshipStatus,
    });

    await newFriendship.save();

    return res.status(200).json({
      code: "post/sendFriendRequest/requestSuccess",
      message: "Friend request sent.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/sendFriendRequest/requestError",
      message: "Server error during sending request.",
    });
  }
};

export const searchFriendRequests = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { limit = 10, friendRequestIDs = [] }: SearchFriendRequestsBody =
      req.body;
    const currentUserID = req.userID!;

    const limitNum: number = Number(limit);

    const baseFilter = {
      recipient: currentUserID,
      status: "pending" satisfies FriendshipStatus,
    };

    const fetchFilter = {
      ...baseFilter,
      _id: { $nin: friendRequestIDs },
    };

    const requests = await Friend.find(fetchFilter)
      .select("id")
      .populate<{ requester: PopulatedUser }>("requester", "username email")
      .limit(limitNum);

    const totalCount: number = await Friend.countDocuments(baseFilter);

    return res.status(200).json({
      code: "post/searchFriendRequests/success",
      message: "Friend requests found.",
      requests,
      hasMore: friendRequestIDs.length + requests.length < totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/searchFriendRequests/error",
      message: "Server error during fetching friend requests.",
    });
  }
};

export const decideFriendRequest = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const rawFriendRequestID: string | string[] | undefined = req.params.id;
    const friendRequestID: string | undefined = Array.isArray(
      rawFriendRequestID,
    )
      ? rawFriendRequestID[0]
      : rawFriendRequestID;
    const { decision }: DecideFriendRequestBody = req.body;
    const currentUserID = req.userID!;

    if (!friendRequestID || !mongoose.Types.ObjectId.isValid(friendRequestID)) {
      return res.status(400).json({
        code: "patch/decideFriendRequest/invalidID",
        message: "Valid friend request ID is required.",
      });
    }

    if (decision !== "accepted" && decision !== "rejected") {
      return res.status(400).json({
        code: "patch/decideFriendRequest/invalidDecision",
        message: "Decision must be 'accepted' or 'rejected'.",
      });
    }

    const friendRequest = await Friend.findById(friendRequestID);

    if (!friendRequest) {
      return res.status(404).json({
        code: "patch/decideFriendRequest/notFound",
        message: "Friend request not found.",
      });
    }

    if (friendRequest.recipient.toString() !== currentUserID) {
      return res.status(403).json({
        code: "patch/decideFriendRequest/unauthorizedRecipient",
        message: "You are not authorized to respond to this request.",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        code: "patch/decideFriendRequest/alreadyResponded",
        message: `This friend request has already been ${friendRequest.status}.`,
      });
    }

    friendRequest.status = decision;

    await friendRequest.save();

    return res.status(200).json({
      code: "patch/decideFriendRequest/success",
      message: `Friend request has been successfully ${decision}.`,
    });
  } catch (error) {
    return res.status(500).json({
      code: "patch/decideFriendRequest/error",
      message: "Server error while processing friend request decision.",
    });
  }
};

export const getFriendList = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const {
      query = "",
      limit = 10,
      friendIDs = [],
    }: GetFriendListBody = req.body;
    const currentUserID = req.userID!;

    const limitNum: number = Number(limit);
    const searchQuery: string = String(query);

    const andConditions: Record<string, unknown>[] = [
      { $or: [{ requester: currentUserID }, { recipient: currentUserID }] },
      { status: "accepted" satisfies FriendshipStatus },
    ];

    if (searchQuery) {
      const matchingUsers = await User.find({
        _id: { $ne: currentUserID },
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }).select("_id");

      const matchedUserIDs: mongoose.Types.ObjectId[] = matchingUsers.map(
        (u) => u._id,
      );

      andConditions.push({
        $or: [
          { requester: { $in: matchedUserIDs } },
          { recipient: { $in: matchedUserIDs } },
        ],
      });
    }

    const baseFilter: Record<string, unknown> = {
      $and: andConditions,
    };

    const fetchFilter: Record<string, unknown> = {
      ...baseFilter,
      _id: { $nin: friendIDs },
    };

    const pendingRequestsFilter = {
      recipient: currentUserID,
      status: "pending" satisfies FriendshipStatus,
    };

    const [friends, totalCount, pendingRequestsCount]: [
      PopulatedFriendDoc[],
      number,
      number,
    ] = await Promise.all([
      Friend.find(fetchFilter)
        .populate<{ requester: PopulatedUser }>("requester", "username email")
        .populate<{ recipient: PopulatedUser }>("recipient", "username email")
        .limit(limitNum),
      Friend.countDocuments(baseFilter),
      Friend.countDocuments(pendingRequestsFilter),
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
      code: "post/getFriendList/success",
      message: "Friends fetched successfully.",
      friends: formattedFriends,
      hasMore: friendIDs.length + friends.length < totalCount,
      pendingRequestsCount,
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/getFriendList/error",
      message: "Server error during fetching friends.",
    });
  }
};
