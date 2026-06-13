import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    const { password, __v, ...safeRet } = ret;
    return safeRet;
  },
});

const User = mongoose.model("User", UserSchema, "Users");

export default User;
