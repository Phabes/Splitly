import type mongoose from "mongoose";

export interface AuditFields {
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FieldValidationError {
  field: string;
  code: string;
  message: string;
}

export interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
}

export interface RequestContextStore {
  userID?: string;
}
