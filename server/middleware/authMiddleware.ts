import { Response, NextFunction } from "express";
import { verifyToken } from "@/utils/verifyToken.ts";
import { requestContext } from "@/utils/requestContext.ts";
import { AuthRequest, JwtPayload } from "@/types/index.ts";

const JWT_SECRET: string = process.env.JWT_SECRET || "SECRET_KEY";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "authentication/noTokenProvided",
      message: "Not authorized. No token provided.",
    });
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      code: "authentication/noTokenProvided",
      message: "Not authorized. No token provided.",
    });
  }

  try {
    const decoded: JwtPayload = verifyToken(token, JWT_SECRET);

    req.userID = decoded.userID;

    return requestContext.run({ userID: decoded.userID }, () => {
      return next();
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "authentication/tokenExpired",
        message: "Token expired.",
      });
    }

    return res.status(401).json({
      code: "authentication/tokenFailed",
      message: "Not authorized. Token failed.",
    });
  }
};
