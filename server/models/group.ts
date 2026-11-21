import mongoose from "mongoose";
import { IGroup } from "@/types/index.ts";

const GroupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  baseCurrency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3,
  },
  icon: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 2,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      role: {
        type: String,
        enum: ["owner", "admin", "member"],
        default: "member",
      },
    },
  ],
});

const Group = mongoose.model<IGroup>("Group", GroupSchema, "Groups");

export default Group;
