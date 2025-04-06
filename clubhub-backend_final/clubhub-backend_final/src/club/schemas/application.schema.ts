import { Schema, Document } from 'mongoose';

export const ApplicationSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  age: { type: Number, required: true },
  activities: { type: String, required: true },
  experience: { type: String, required: true },
  cvFile: { type: String, required: true }, // Stores CV file path
  payment: { type: String, enum: ['yes', 'no'], default: 'no' }, // Add payment field
});

export interface Application extends Document {
  memberId: string;
  clubId: string;
  status: string;
  age: number;
  activities: string;
  experience: string;
  cvFile: string;
  payment: string; // Add payment to the Application interface
}
