import { Router } from "express";
import signUp from "../controllers/user.js";

const routerUser = Router();

routerUser.post("/signUp", signUp);

export default routerUser;
