import mongoose from "mongoose";
import { Response, NextFunction } from "express";
import Group from "@/models/group.ts";
import { GroupDocument, GroupRequest } from "@/types/index.ts";

export const groupMiddleware = async (
  req: GroupRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const rawGroupID: unknown = req.params.groupID ?? req.body?.groupID;
    const currentUserID: string | undefined = req.userID;

    if (
      typeof rawGroupID !== "string" ||
      rawGroupID.trim().length === 0 ||
      !mongoose.Types.ObjectId.isValid(rawGroupID)
    ) {
      return res.status(400).json({
        code: "groupAuthentication/invalidID",
        message: "Invalid group ID.",
      });
    }

    const groupID: string = rawGroupID.trim();
    const group: GroupDocument | null = await Group.findById(groupID);

    if (!group) {
      return res.status(404).json({
        code: "groupAuthentication/notFound",
        message: "Group not found.",
      });
    }

    const isMember: boolean =
      typeof currentUserID === "string" &&
      currentUserID.trim().length > 0 &&
      group.members.some((m) => {
        if (!m?.user) {
          return false;
        }

        const memberUserID: string =
          typeof m.user === "object" && "_id" in m.user
            ? String(m.user._id)
            : String(m.user);

        return memberUserID === currentUserID;
      });

    if (!isMember) {
      return res.status(403).json({
        code: "groupAuthentication/accessDenied",
        message: "You do not have permission to view this group's data.",
      });
    }

    req.group = group;

    return next();
  } catch (error) {
    return res.status(500).json({
      code: "groupAuthentication/error",
      message: "Server error verifying membership.",
    });
  }
};
