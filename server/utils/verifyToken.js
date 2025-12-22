import jwt from "jsonwebtoken";

/**
 * @param {string} token
 * @param {string} secretKey
 */
export const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};
