import { verifyToken } from "../utils/verifyToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = verifyToken(token, JWT_SECRET);

      req.userId = decoded.userId;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ code: "tokenExpired", message: "Token expired." });
      }

      return res.status(401).json({
        code: "tokenFailed",
        message: "Not authorized. Token failed.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      code: "noToenProvided",
      message: "Not authorized. No token provided.",
    });
  }
};
