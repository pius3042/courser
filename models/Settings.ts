import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  currentSession: string;
  currentSemester: number;
  registrationOpen: boolean;
  allowLateRegistration: boolean;
  maxUnitsPerSemester: number;
  requirePrerequisiteCheck: boolean;
  autoApproveRegistrations: boolean;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  currentSession: { type: String, default: '2025/2026' },
  currentSemester: { type: Number, default: 1 },
  registrationOpen: { type: Boolean, default: true },
  allowLateRegistration: { type: Boolean, default: false },
  maxUnitsPerSemester: { type: Number, default: 24 },
  requirePrerequisiteCheck: { type: Boolean, default: true },
  autoApproveRegistrations: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
