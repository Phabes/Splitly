import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/authMiddleware.ts";
import User from "@/models/user.ts";
import { generateTokens } from "@/utils/generateTokens.ts";
import { verifyToken } from "@/utils/verifyToken.ts";
import { signInValidator, signUpValidator } from "@/validators/users.ts";
import { getSafeUser } from "@/utils/getSafeUser.ts";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";

export const verifyUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({
        code: "verification/userNotFound",
        message: "User not found.",
      });
    }

    const safeUser = getSafeUser(user);

    return res.status(200).json({
      code: "verification/success",
      message: "Validation success.",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      code: "verification/error",
      message: "Internal server error.",
    });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({
      code: "tokensRenewal/noRefreshToken",
      message: "Refresh token required",
    });

  try {
    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);

    const { userToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userID,
    );

    const user = await User.findById(decoded.userID);

    if (!user) {
      return res.status(404).json({
        code: "tokensRenewal/userNotFound",
        message: "User not found.",
      });
    }

    const safeUser = getSafeUser(user);

    return res.status(200).json({
      code: "tokensRenewal/success",
      message: "Tokens successfully refreshed.",
      userToken,
      refreshToken: newRefreshToken,
      user: safeUser,
    });
  } catch (error) {
    return res.status(403).json({
      code: "tokensRenewal/error",
      message: "Session expired. Please sign in again.",
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const validationErrors = await signUpValidator(email, username);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        code: "signUp/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    const { userToken, refreshToken } = generateTokens(newUser._id.toString());

    const safeUser = getSafeUser(newUser);

    return res.status(201).json({
      code: "signUp/success",
      message: "User created.",
      userToken,
      refreshToken,
      user: safeUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "signUp/error", message: "Internal server error." });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const { validationErrors, user } = await signInValidator(
      username,
      password,
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        code: "signIn/fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const { userToken, refreshToken } = generateTokens(user!._id.toString());

    return res.status(201).json({
      code: "signIn/success",
      message: "User logged in.",
      userToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "signIn/error", message: "Internal server error." });
  }
};
