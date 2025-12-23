import { Router } from "express";
import { refresh, signIn, signUp, verifyUser } from "controllers/user";
import { protect } from "middleware/authMiddleware";

const routerUser = Router();

routerUser.get("/verify", protect, verifyUser);
routerUser.post("/refresh", refresh);
routerUser.post("/signUp", signUp);
routerUser.post("/signIn", signIn);

export default routerUser;
