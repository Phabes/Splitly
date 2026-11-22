import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "@/types/index.ts";
import { auditPlugin } from "@/plugins/auditPlugin.ts";

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const raw = ret as unknown as Record<string, unknown>;
    const { password: _password, __v: _version, ...safeRet } = raw;
    return safeRet;
  },
});

UserSchema.plugin(auditPlugin);

const User = mongoose.model<IUser>("User", UserSchema, "Users");

export default User;
