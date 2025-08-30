// lib/models/File.ts
import mongoose, { Schema } from "mongoose";

export interface IFile {
  userEmail: string;
  filename: string;
  s3Key: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>({
  userEmail: { type: String, required: true, index: true },
  filename: { type: String, required: true },
  s3Key: { type: String, required: true, unique: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite on hot reload
export default (mongoose.models.File as mongoose.Model<IFile>) ||
  mongoose.model("File", FileSchema);
