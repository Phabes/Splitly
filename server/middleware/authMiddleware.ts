import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifyToken.js";

export type AuthRequest = Request & {
  userID?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token === undefined) {
        throw new Error("noTokenProvided");
      }

      const decoded = verifyToken(token, JWT_SECRET);

      req.userID = decoded.userID;

      return next();
    } catch (error: any) {
      if (token === undefined) {
        return res.status(401).json({
          code: "authentication/noTokenProvided",
          message: "Not authorized. No token provided.",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          code: "authentication/tokenExpired",
          message: "Token expired.",
        });
      }
    }

    return res.status(401).json({
      code: "authentication/tokenFailed",
      message: "Not authorized. Token failed.",
    });
  }
};
