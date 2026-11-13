import { Response, NextFunction } from "express";
import { GroupRequest } from "./groupMiddleware.ts";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: GroupRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserID = req.userID;
      const group = req.group!;

      const currentMember = group.members.find(
        (m: any) => m.user.toString() === currentUserID?.toString(),
      )!;

      if (!allowedRoles.includes(currentMember.role)) {
        return res.status(403).json({
          code: "roleAuthentication/forbidden",
          message: `You do not have permissions. Required roles: ${allowedRoles.join(", ")}.`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        code: "roleAuthentication/error",
        message: "Server error verifying group roles.",
      });
    }
  };
};
