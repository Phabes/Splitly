import { Router } from "express";
import {
  createGroup,
  decideGroupRequest,
  getGroupDetails,
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

export default routerGroup;
