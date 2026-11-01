import { AuthRequest } from "@/middleware/authMiddleware.ts";
import Bill from "@/models/bill.ts";
import { Response } from "express";

export const createBill = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const currentUserID = req.userID;
    const { groupID, name, totalAmount, currency, positions } = req.body;

    if (
      !groupID ||
      !name ||
      totalAmount === undefined ||
      !currency ||
      !positions
    ) {
      return res.status(400).json({
        code: "createBill/missingFields",
        message: "Please provide all required bill fields.",
      });
    }

    const newBill = new Bill({
      groupID,
      name,
      totalAmount: Number(totalAmount),
      currency,
      positions,
      createdBy: currentUserID,
    });

    const savedBill = await newBill.save();

    return res.status(201).json({
      code: "createBill/success",
      message: "Bill created successfully.",
      bill: savedBill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    return res.status(500).json({
      code: "createBill/error",
      message: "Server error during bill creation.",
    });
  }
};
