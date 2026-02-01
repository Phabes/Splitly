import { Request, Response } from "express";
import { signInValidator, signUpValidator } from "../validators/user.js";
import { generateTokens } from "../utils/generateTokens.js";
import { verifyToken } from "../utils/verifyToken.js";
import { AuthRequest } from "middleware/authMiddleware.js";
import User from "models/user.js";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "REFRESH_KEY";

export const verifyUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ code: "userNotFound", message: "User not found." });
    }

    return res.status(200).json({
      code: "validationSuccess",
      message: "Validation success.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "internalError", message: "Internal server error." });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res
      .status(401)
      .json({ code: "noRefreshToken", message: "Refresh token required" });

  try {
    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);

    const { userToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
    );

    return res.status(200).json({
      code: "refreshSuccess",
      message: "Tokens successfully refreshed.",
      userToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({
      code: "invalidRefreshToken",
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
        code: "fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    const { userToken, refreshToken } = generateTokens(newUser._id.toString());

    return res.status(201).json({
      code: "signUpSuccess",
      message: "User created.",
      userToken,
      refreshToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "internalError", message: "Internal server error." });
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
        code: "fieldsValidationError",
        message: "Fields validation error.",
        errorFields: validationErrors,
      });
    }

    const { userToken, refreshToken } = generateTokens(user!._id.toString());

    return res.status(201).json({
      code: "signInSuccess",
      message: "User logged in.",
      userToken,
      refreshToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "internalError", message: "Internal server error." });
  }
};
