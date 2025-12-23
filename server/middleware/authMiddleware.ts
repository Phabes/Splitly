import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifyToken.js";

export type AuthRequest = Request & {
  userId?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = verifyToken(token, JWT_SECRET);

      req.userId = decoded.userId;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ code: "tokenExpired", message: "Token expired." });
      }

      return res.status(401).json({
        code: "tokenFailed",
        message: "Not authorized. Token failed.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      code: "noToenProvided",
      message: "Not authorized. No token provided.",
    });
  }
};
