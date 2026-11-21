import { JwtPayload } from "@/types/index.ts";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "SECRET_KEY";
const JWT_TIME: SignOptions["expiresIn"] =
  (process.env.JWT_TIME as SignOptions["expiresIn"]) || "1m";

const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";
const JWT_REFRESH_TIME: SignOptions["expiresIn"] =
  (process.env.JWT_REFRESH_TIME as SignOptions["expiresIn"]) || "2m";

export interface GeneratedTokens {
  userToken: string;
  refreshToken: string;
}

export const generateTokens = (userID: string): GeneratedTokens => {
  if (typeof userID !== "string" || userID.trim().length === 0) {
    throw new Error("Cannot generate tokens without a valid userID.");
  }

  const payload: JwtPayload = { userID };

  const userToken: string = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_TIME,
  });

  const refreshToken: string = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_TIME,
  });

  return { userToken, refreshToken };
};
