import { Router } from "express";
import {
  decideFriendRequest,
  getFriendList,
  searchFriendRequests,
  searchFriendSuggestions,
  sendFriendRequest,
} from "@/controllers/friends.ts";
import { authMiddleware } from "@/middleware/authMiddleware.ts";

const routerFriend = Router();

// GET - friend suggestions
routerFriend.post(
  "/suggestions/search",
  authMiddleware,
  searchFriendSuggestions,
);
// GET - friend requests
routerFriend.post("/requests/search", authMiddleware, searchFriendRequests);
// POST - send friend request
routerFriend.post("/requests", authMiddleware, sendFriendRequest);
// PATCH - accept/decline friend request
routerFriend.patch("/requests/:id", authMiddleware, decideFriendRequest);
// GET - friend list
routerFriend.post("/list", authMiddleware, getFriendList);

export default routerFriend;
