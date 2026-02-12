import { Router } from "express";
import { sendFriendRequest, searchUsers } from "controllers/friend";
import { protect } from "middleware/authMiddleware";

const routerFriend = Router();

routerFriend.post("/possible", protect, searchUsers);
routerFriend.post("/request", protect, sendFriendRequest);

export default routerFriend;
