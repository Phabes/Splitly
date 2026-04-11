import { Router } from "express";
import {
  sendFriendRequest,
  searchFriendSuggestions,
  searchFriendRequests,
  decideFriendRequest,
  getFriendList,
} from "controllers/friends";
import { protect } from "middleware/authMiddleware";

const routerFriend = Router();

// GET - friend suggestions
routerFriend.post("/suggestions/search", protect, searchFriendSuggestions);
// GET - friend requests
routerFriend.post("/requests/search", protect, searchFriendRequests);
// POST - send friend request
routerFriend.post("/requests", protect, sendFriendRequest);
// PATCH - accept/decline friend request
routerFriend.patch("/requests/:id", protect, decideFriendRequest);
// GET - friend list
routerFriend.post("/list", protect, getFriendList);

export default routerFriend;
