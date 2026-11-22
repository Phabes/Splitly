import mongoose from "mongoose";
import { IBill, IBillInstance, IBillPosition } from "@/types/index.ts";
import { auditPlugin } from "@/plugins/auditPlugin.ts";

const InstanceSchema = new mongoose.Schema<IBillInstance>({
  isSharedByAll: {
    type: Boolean,
    default: false,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const PositionSchema = new mongoose.Schema<IBillPosition>({
  name: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isSharedByAll: {
    type: Boolean,
    default: true,
  },
  instances: [InstanceSchema],
});

const BillSchema = new mongoose.Schema<IBill>({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  payerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  involvedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  positions: [PositionSchema],
});

BillSchema.plugin(auditPlugin);

const Bill = mongoose.model<IBill>("Bill", BillSchema, "Bills");

export default Bill;
