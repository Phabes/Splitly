import type { Request } from "express";
import type { SignOptions } from "jsonwebtoken";
import type { FieldValidationError } from "./common.ts";
import { SafeUser } from "./users.ts";

export type TokenExpiry = SignOptions["expiresIn"];

export type JwtPayload = {
  userID: string;
};

export interface GeneratedTokens {
  userToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  userID?: string;
}

export interface RefreshTokensBody {
  refreshToken?: string;
}

export interface SignUpBody {
  email?: string;
  username?: string;
  password?: string;
}

export interface SignInBody {
  username?: string;
  password?: string;
}

export interface SignInValidationResult {
  validationErrors: FieldValidationError[];
  user: SafeUser | null;
}
