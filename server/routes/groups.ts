import { Router } from "express";
import { getGroupList } from "@/controllers/groups.ts";
import { protect } from "@/middleware/authMiddleware.ts";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);

export default routerGroup;
