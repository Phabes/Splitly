import { Router } from "express";
import { getGroupList } from "controllers/groups";
import { protect } from "middleware/authMiddleware";

const routerGroup = Router();

// GET - group list
routerGroup.post("/list", protect, getGroupList);

export default routerGroup;
