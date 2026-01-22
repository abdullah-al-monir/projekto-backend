import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "./User.js";

export interface IInvite extends Document {
  email: string;
  role: Exclude<UserRole, "ADMIN">;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    role: {
      type: String,
      enum: ["MANAGER", "STAFF"],
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

export const Invite = mongoose.model<IInvite>("Invite", InviteSchema);
