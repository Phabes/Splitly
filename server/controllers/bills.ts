import { AuthRequest } from "@/middleware/authMiddleware.ts";
import Bill from "@/models/bill.ts";
import { Response } from "express";

export const createBill = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const currentUserID = req.userID;
    const {
      groupID,
      name,
      totalAmount,
      currency,
      payerID,
      involvedMembers,
      positions,
    } = req.body;

    if (
      !groupID ||
      !name ||
      totalAmount === undefined ||
      !currency ||
      !payerID ||
      !involvedMembers ||
      !positions
    ) {
      return res.status(400).json({
        code: "createBill/missingFields",
        message: "Please provide all required bill fields.",
      });
    }

    const processedPositions = positions.map((pos: any) => {
      const quantity = Number(pos.quantity) || 1;
      const isSharedByAll = Boolean(pos.isSharedByAll);
      const instances = [];

      if (!isSharedByAll) {
        for (let i = 0; i < quantity; i++) {
          instances.push({
            isSharedByAll: false,
            members: [],
          });
        }
      }

      return {
        name: pos.name,
        unitPrice: Number(pos.unitPrice),
        quantity,
        isSharedByAll,
        ...(instances.length > 0 && { instances }),
      };
    });

    const newBill = new Bill({
      groupID,
      name,
      totalAmount: Number(totalAmount),
      currency,
      payerID,
      involvedMembers,
      positions: processedPositions,
      createdBy: currentUserID,
    });

    await newBill.save();

    return res.status(201).json({
      code: "createBill/success",
      message: "Bill created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "createBill/error",
      message: "Server error during bill creation.",
    });
  }
};
