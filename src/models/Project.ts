import mongoose, { Schema, Document, Types } from 'mongoose';

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface IProject extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'DELETED'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ProjectSchema.index({ isDeleted: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);