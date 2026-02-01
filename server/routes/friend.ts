import { Router } from "express";
import { searchUsers } from "controllers/friend";
import { protect } from "middleware/authMiddleware";

const routerFriend = Router();

routerFriend.post("/possible", protect, searchUsers);

export default routerFriend;
