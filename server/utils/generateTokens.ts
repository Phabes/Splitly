import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
const JWT_TIME = process.env.JWT_TIME || "1m";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";
const JWT_REFRESH_TIME = process.env.JWT_REFRESH_TIME || "2m";

export const generateTokens = (userId: string) => {
  const userToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_TIME as SignOptions["expiresIn"],
  });

  /** @type {string} */
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_TIME as SignOptions["expiresIn"],
  });

  return { userToken, refreshToken };
};
