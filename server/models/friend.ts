import mongoose from "mongoose";
import { IFriend } from "@/types/index.ts";

const FriendSchema = new mongoose.Schema<IFriend>({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
    default: "pending",
  },
});

FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friend = mongoose.model<IFriend>("Friend", FriendSchema, "Friends");

export default Friend;
