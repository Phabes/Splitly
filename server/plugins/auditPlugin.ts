import mongoose, { Schema, Query, UpdateQuery } from "mongoose";
import { getCurrentUserID } from "@/utils/requestContext.ts";
import { AuditFields } from "@/types/index.ts";

export function auditPlugin(schema: Schema): void {
  // 1. Add who columns to the schema
  schema.add({
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      immutable: true,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  });

  // 2. Ensure timestamps (createdAt, updatedAt) are enabled
  schema.set("timestamps", true);

  // 3. Handle .save() and .create()
  schema.pre("save", function (next) {
    const userId = getCurrentUserID();
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId);
      if (this.isNew && !this.get("createdBy")) {
        this.set("createdBy", objectId);
      }
      this.set("updatedBy", objectId);
    }
    next();
  });

  // 4. Handle Model.insertMany()
  schema.pre("insertMany", function (next, docs: Record<string, unknown>[]) {
    const userId = getCurrentUserID();
    if (
      userId &&
      mongoose.Types.ObjectId.isValid(userId) &&
      Array.isArray(docs)
    ) {
      const objectId = new mongoose.Types.ObjectId(userId);
      for (const doc of docs) {
        if (!doc.createdBy) {
          doc.createdBy = objectId;
        }
        doc.updatedBy = objectId;
      }
    }
    next();
  });

  // 5. Handle query updates (findOneAndUpdate, updateOne, updateMany)
  const handleQueryUpdate = function (
    this: Query<unknown, unknown>,
    next: (err?: Error) => void,
  ) {
    const userId = getCurrentUserID();
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId);
      const update = (this.getUpdate() || {}) as UpdateQuery<AuditFields>;

      if (update.$set) {
        update.$set.updatedBy = objectId;
      } else {
        this.setUpdate({
          ...update,
          $set: {
            ...(update.$set ?? {}),
            updatedBy: objectId,
          },
        });
      }

      // If upsert: true creates a new document, set createdBy via $setOnInsert
      if (this.getOptions().upsert) {
        const currentUpdate = this.getUpdate() as UpdateQuery<AuditFields>;
        this.setUpdate({
          ...currentUpdate,
          $setOnInsert: {
            ...(currentUpdate.$setOnInsert ?? {}),
            createdBy: objectId,
          },
        });
      }
    }
    next();
  };

  schema.pre("findOneAndUpdate", handleQueryUpdate);
  schema.pre("updateOne", handleQueryUpdate);
  schema.pre("updateMany", handleQueryUpdate);
}
