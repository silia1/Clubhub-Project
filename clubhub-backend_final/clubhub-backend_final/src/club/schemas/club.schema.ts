// src/schemas/club.schema.ts
import { Schema, Document } from 'mongoose';

export const ClubSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  adminId: { type: String, required: true },
  numberOfPeople: { type: Number, required: true }, // Total number of people allowed
  currentMembers: { type: Number, default: 0 }, // Tracks current number of accepted members
  appliedCount: { type: Number, default: 0 }, // Tracks the number of people who have applied
});

export interface Club extends Document {
  name: string;
  description: string;
  adminId: string;
  numberOfPeople: number;
  currentMembers: number;
  appliedCount: number; // New field for tracking applied count
}
