import mongoose, { HydratedDocument } from "mongoose";
import type { AuditFields } from "./common.ts";

export interface IBillInstance {
  isSharedByAll: boolean;
  members: mongoose.Types.ObjectId[];
}

export interface IBillPosition {
  name: string;
  unitPrice: number;
  quantity: number;
  isSharedByAll: boolean;
  instances: IBillInstance[];
}

export interface IBill extends AuditFields {
  groupID: mongoose.Types.ObjectId;
  name: string;
  totalAmount: number;
  currency: string;
  payerID: mongoose.Types.ObjectId;
  involvedMembers: mongoose.Types.ObjectId[];
  positions: IBillPosition[];
}

export type BillDocument = HydratedDocument<IBill>;

export interface IncomingPosition {
  name: string;
  unitPrice: number;
  quantity: number;
  isSharedByAll: boolean;
}
