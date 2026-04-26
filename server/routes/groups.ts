import { Router } from "express";
import { createGroup, getGroupList } from "@/controllers/groups.ts";
import { protect } from "@/middleware/authMiddleware.ts";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);
// POST - create group
routerGroup.post("/", protect, createGroup);

export default routerGroup;
