import mongoose, { HydratedDocument } from "mongoose";
import type { AuditFields } from "./common.ts";

export interface IUser extends AuditFields {
  email: string;
  username: string;
  password: string;
}

export type UserDocument = HydratedDocument<IUser>;

export type SafeUser = Omit<IUser, "password"> & {
  _id: mongoose.Types.ObjectId | string;
};
