import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
const JWT_TIME = process.env.JWT_TIME || "1m";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";
const JWT_REFRESH_TIME = process.env.JWT_REFRESH_TIME || "2m";

export const generateTokens = (userID: string) => {
  const userToken = jwt.sign({ userID }, JWT_SECRET, {
    expiresIn: JWT_TIME as SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ userID }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_TIME as SignOptions["expiresIn"],
  });

  return { userToken, refreshToken };
};
