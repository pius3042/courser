import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  title: string;
  units: number;
  department: string;
  level: number;
  semester: number;
  compulsory: boolean;
  prerequisites: string[];
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  units: { type: Number, required: true },
  department: { type: String, required: true },
  level: { type: Number, required: true },
  semester: { type: Number, required: true },
  compulsory: { type: Boolean, default: false },
  prerequisites: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
