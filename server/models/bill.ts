import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
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
  assignedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const BillSchema = new mongoose.Schema({
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
  positions: [PositionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Bill = mongoose.model("Bill", BillSchema, "Bills");

export default Bill;
