import { JwtPayload } from "@/types/index.ts";
import jwt from "jsonwebtoken";

const isJwtPayload = (decoded: unknown): decoded is JwtPayload => {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    "userID" in decoded &&
    typeof (decoded as { userID: unknown }).userID === "string" &&
    (decoded as { userID: string }).userID.trim().length > 0
  );
};

export const verifyToken = (token: string, secretKey: string): JwtPayload => {
  const decoded: string | jwt.JwtPayload = jwt.verify(token, secretKey);

  if (!isJwtPayload(decoded)) {
    throw new Error("Invalid token payload.");
  }

  return decoded;
};
