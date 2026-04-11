import { getGroupList } from "@/controllers/groups.ts";
import { protect } from "@/middleware/authMiddleware.ts";
import { Router } from "express";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);

export default routerGroup;
