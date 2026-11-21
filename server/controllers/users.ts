import { Request, Response } from "express";
import { getSafeUser } from "@/utils/getSafeUser.ts";
import { generateTokens } from "@/utils/generateTokens.ts";
import { verifyToken } from "@/utils/verifyToken.ts";
import { signInValidator, signUpValidator } from "@/validators/users.ts";
import User from "@/models/user.ts";
import {
  AuthRequest,
  FieldValidationError,
  JwtPayload,
  RefreshTokensBody,
  SignInBody,
  SignUpBody,
  UserDocument,
} from "@/types/index.ts";

const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";

export const verifyUser = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const currentUserID: string = req.userID!;
    const user: UserDocument | null = await User.findById(currentUserID);

    if (!user) {
      return res.status(404).json({
        code: "get/verifyUser/userNotFound",
        message: "User not found.",
      });
    }

    const safeUser = getSafeUser(user);

    return res.status(200).json({
      code: "get/verifyUser/success",
      message: "Validation success.",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      code: "get/verifyUser/error",
      message: "Internal server error.",
    });
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { refreshToken }: RefreshTokensBody = req.body;

  if (typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
    return res.status(401).json({
      code: "post/refreshTokens/noRefreshToken",
      message: "Refresh token required",
    });
  }

  try {
    const decoded: JwtPayload = verifyToken(refreshToken, JWT_REFRESH_SECRET);

    const { userToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userID,
    );

    const user: UserDocument | null = await User.findById(decoded.userID);

    if (!user) {
      return res.status(404).json({
        code: "post/refreshTokens/userNotFound",
        message: "User not found.",
      });
    }

    const safeUser = getSafeUser(user);

    return res.status(200).json({
      code: "post/refreshTokens/success",
      message: "Tokens successfully refreshed.",
      userToken,
      refreshToken: newRefreshToken,
      user: safeUser,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid token payload.") {
      return res.status(401).json({
        code: "post/refreshTokens/invalidPayload",
        message: "Invalid refresh token payload.",
      });
    }

    return res.status(403).json({
      code: "post/refreshTokens/error",
      message: "Session expired. Please sign in again.",
    });
  }
};

export const signUp = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, username, password }: SignUpBody = req.body;

    const missingOrInvalidTypes: FieldValidationError[] = [];

    if (typeof email !== "string") {
      missingOrInvalidTypes.push({
        field: "email",
        code: "invalidType",
        message: "Email must be a string.",
      });
    }

    if (typeof username !== "string") {
      missingOrInvalidTypes.push({
        field: "username",
        code: "invalidType",
        message: "Username must be a string.",
      });
    }

    if (typeof password !== "string") {
      missingOrInvalidTypes.push({
        field: "password",
        code: "invalidType",
        message: "Password must be a string.",
      });
    }

    if (missingOrInvalidTypes.length > 0) {
      return res.status(400).json({
        code: "post/signUp/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: missingOrInvalidTypes,
      });
    }

    const validEmail: string = email as string;
    const validUsername: string = username as string;
    const validPassword: string = password as string;

    const validationErrors: FieldValidationError[] = await signUpValidator(
      validEmail,
      validUsername,
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        code: "post/signUp/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const newUser: UserDocument = new User({
      email: validEmail,
      username: validUsername,
      password: validPassword,
    });
    await newUser.save();

    const { userToken, refreshToken } = generateTokens(newUser._id.toString());

    const safeUser = getSafeUser(newUser);

    return res.status(201).json({
      code: "post/signUp/success",
      message: "User created.",
      userToken,
      refreshToken,
      user: safeUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "post/signUp/error", message: "Internal server error." });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { username, password }: SignInBody = req.body;

    const missingOrInvalidTypes: FieldValidationError[] = [];

    if (typeof username !== "string") {
      missingOrInvalidTypes.push({
        field: "username",
        code: "invalidType",
        message: "Username must be a string.",
      });
    }

    if (typeof password !== "string") {
      missingOrInvalidTypes.push({
        field: "password",
        code: "invalidType",
        message: "Password must be a string.",
      });
    }

    if (missingOrInvalidTypes.length > 0) {
      return res.status(400).json({
        code: "post/signIn/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: missingOrInvalidTypes,
      });
    }

    const validUsername: string = username as string;
    const validPassword: string = password as string;

    const { validationErrors, user } = await signInValidator(
      validUsername,
      validPassword,
    );

    if (validationErrors.length > 0 || !user) {
      return res.status(400).json({
        code: "post/signIn/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const { userToken, refreshToken } = generateTokens(user._id.toString());

    return res.status(201).json({
      code: "post/signIn/success",
      message: "User logged in.",
      userToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "post/signIn/error", message: "Internal server error." });
  }
};
