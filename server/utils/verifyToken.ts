import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
};

export const verifyToken = (token: string, secretKey: string) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
