import { Router } from "express";
import {
  sendFriendRequest,
  searchFriendSuggestions,
  searchFriendRequests,
  decideFriendRequest,
} from "controllers/friends";
import { protect } from "middleware/authMiddleware";

const routerFriend = Router();

// GET - friend suggestions
routerFriend.post("/suggestions/search", protect, searchFriendSuggestions);
// GET - friend requests
routerFriend.post("/requests/search", protect, searchFriendRequests);
// POST - friend requests
routerFriend.post("/requests", protect, sendFriendRequest);
// PATCH - accept/decline friend request
routerFriend.patch("/requests/:id", protect, decideFriendRequest);

export default routerFriend;
