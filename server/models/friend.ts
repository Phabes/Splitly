import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
  },
});

FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friend = mongoose.model("Friend", FriendSchema, "Friends");

export default Friend;
