import mongoose from "mongoose";

export interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
}

export interface IncomingPosition {
  name: string;
  unitPrice: number;
  quantity: number;
  isSharedByAll: boolean;
}
