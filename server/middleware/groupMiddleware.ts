import Group from "@/models/group.ts";
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.ts";

export type GroupRequest = AuthRequest & {
  group?: InstanceType<typeof Group>;
};

export const groupMiddleware = async (
  req: GroupRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const groupID = req.params.groupID || req.body.groupID;
    const currentUserID = req.userID;

    const group = await Group.findById(groupID);

    if (!group) {
      return res.status(404).json({
        code: "groupAuthentication/not-found",
        message: "Group not found.",
      });
    }

    const isMember = group.members.some(
      (m: any) => m.user.toString() === currentUserID?.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        code: "groupAuthentication/access-denied",
        message: "You do not have permission to view this group's data.",
      });
    }

    req.group = group;

    next();
  } catch (error) {
    res.status(500).json({
      code: "groupAuthentication/error",
      message: "Server error verifying membership.",
    });
  }
};
