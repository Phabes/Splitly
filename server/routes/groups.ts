import { Router } from "express";
import {
  addGroupMembers,
  createGroup,
  decideGroupRequest,
  editGroupDetails,
  getGroupDetails,
  getGroupInviteCandidates,
  getGroupList,
  searchGroupRequests,
} from "@/controllers/groups.ts";
import { protect } from "@/middleware/authMiddleware.ts";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);
// POST - create group
routerGroup.post("/", protect, createGroup);
// GET - group requests
routerGroup.post("/requests/search", protect, searchGroupRequests);
// PATCH - accept/decline group request
routerGroup.patch("/requests/:groupRequestID", protect, decideGroupRequest);
// GET - group details
routerGroup.get("/:groupID", protect, getGroupDetails);
// PATCH - edit group details
routerGroup.patch("/:groupID", protect, editGroupDetails);
// GET - group members candidates
routerGroup.post("/candidates", protect, getGroupInviteCandidates);
// POST - add group members
routerGroup.post("/members", protect, addGroupMembers);

export default routerGroup;
