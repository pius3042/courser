import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  studentId: mongoose.Types.ObjectId;
  session: string;
  semester: number;
  courses: string[];
  totalUnits: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  session: { type: String, required: true },
  semester: { type: Number, required: true },
  courses: [{ type: String, required: true }],
  totalUnits: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'closed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
