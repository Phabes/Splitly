import { Router } from "express";
import {
  addGroupMembers,
  createGroup,
  decideGroupRequest,
  editGroupDetails,
  getGroupDetails,
  getGroupInviteCandidates,
  getGroupList,
  removeGroupMember,
  searchGroupRequests,
} from "@/controllers/groups.ts";
import { authMiddleware } from "@/middleware/authMiddleware.ts";
import { groupMiddleware } from "@/middleware/groupMiddleware.ts";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", authMiddleware, getGroupList);
// POST - create group
routerGroup.post("/", authMiddleware, createGroup);
// GET - group requests
routerGroup.post("/requests/search", authMiddleware, searchGroupRequests);
// PATCH - accept/decline group request
routerGroup.patch(
  "/requests/:groupRequestID",
  authMiddleware,
  decideGroupRequest,
);
// GET - group details
routerGroup.get("/:groupID", authMiddleware, groupMiddleware, getGroupDetails);
// PATCH - edit group details
routerGroup.patch(
  "/:groupID",
  authMiddleware,
  groupMiddleware,
  editGroupDetails,
);
// GET - group members candidates
routerGroup.post("/candidates", authMiddleware, getGroupInviteCandidates);
// POST - add group members
routerGroup.post("/members", authMiddleware, groupMiddleware, addGroupMembers);
// DELETE - remove group member
routerGroup.delete(
  "/:groupID/members/:memberID",
  authMiddleware,
  groupMiddleware,
  removeGroupMember,
);

export default routerGroup;
