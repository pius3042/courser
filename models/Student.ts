import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  matricNumber: string;
  email: string;
  password: string;
  department: string;
  level: number;
  semester: number;
  completedCourses: string[];
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  matricNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: Number, required: true },
  semester: { type: Number, required: true },
  completedCourses: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
