import { Router } from "express";
import { refreshTokens, signIn, signUp, verifyUser } from "controllers/users";
import { protect } from "middleware/authMiddleware";

const routerUser = Router();

// GET - verify user
routerUser.get("/verification", protect, verifyUser);
// POST - refresh tokens
routerUser.post("/tokens/renewal", refreshTokens);
// POST - sign up
routerUser.post("/signUp", signUp);
// POST - sign in
routerUser.post("/signIn", signIn);

export default routerUser;
