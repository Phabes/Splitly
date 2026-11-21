import { GroupRequest } from "@/types/index.ts";
import { Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (
    req: GroupRequest,
    res: Response,
    next: NextFunction,
  ): Response | void => {
    try {
      const currentUserID: string | undefined = req.userID;
      const group = req.group!;

      const currentMember =
        typeof currentUserID === "string" && currentUserID.trim().length > 0
          ? group.members.find((m) => {
              if (!m?.user) {
                return false;
              }

              const memberUserID: string =
                typeof m.user === "object" && "_id" in m.user
                  ? String(m.user._id)
                  : String(m.user);

              return memberUserID === currentUserID;
            })
          : undefined;

      if (!currentMember || !allowedRoles.includes(currentMember.role)) {
        return res.status(403).json({
          code: "roleAuthentication/forbidden",
          message: `You do not have permissions. Required roles: ${allowedRoles.join(", ")}.`,
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        code: "roleAuthentication/error",
        message: "Server error verifying group roles.",
      });
    }
  };
};
