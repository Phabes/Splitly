import { Router } from "express";
import {
  createGroup,
  decideGroupRequest,
  getGroupList,
  searchGroupRequests,
} from "@/controllers/groups.ts";
import { protect } from "@/middleware/authMiddleware.ts";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);
// POST - create group
routerGroup.post("/", protect, createGroup);
// GET - friend requests
routerGroup.post("/requests/search", protect, searchGroupRequests);
// PATCH - accept/decline friend request
routerGroup.patch("/requests/:id", protect, decideGroupRequest);

export default routerGroup;
