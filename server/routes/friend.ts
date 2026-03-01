import { Router } from "express";
import {
  sendFriendRequest,
  searchUsers,
  searchFriendRequests,
  decideFriendRequest,
} from "controllers/friend";
import { protect } from "middleware/authMiddleware";

const routerFriend = Router();

routerFriend.post("/possible", protect, searchUsers);
routerFriend.post("/request", protect, sendFriendRequest);
routerFriend.post("/requests", protect, searchFriendRequests);
routerFriend.post("/request/decision", protect, decideFriendRequest);

export default routerFriend;
