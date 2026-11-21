import { Response } from "express";
import Bill from "@/models/bill.ts";
import {
  AuthRequest,
  BillDocument,
  IBillInstance,
  IncomingPosition,
} from "@/types/index.ts";

export const createBill = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
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
        code: "post/createBill/missingFields",
        message: "Please provide all required bill fields.",
      });
    }

    const processedPositions = positions.map((pos: IncomingPosition) => {
      const quantity = Number(pos.quantity) || 1;
      const isSharedByAll = Boolean(pos.isSharedByAll);
      const instances: IBillInstance[] = [];

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

    const newBill: BillDocument = new Bill({
      groupID,
      name,
      totalAmount: Number(totalAmount),
      currency,
      payerID,
      involvedMembers,
      positions: processedPositions,
    });

    await newBill.save();

    return res.status(201).json({
      code: "post/createBill/success",
      message: "Bill created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: "post/createBill/error",
      message: "Server error during bill creation.",
    });
  }
};
