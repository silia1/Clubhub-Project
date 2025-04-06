// src/interested-members/schema/interested-members.schema.ts

import mongoose, { Schema, Document, model, Types } from 'mongoose';

export interface InterestedMember extends Document {
  memberId: Types.ObjectId; // Define as ObjectId type in interface
  eventId: string;
}

const InterestedMemberSchema = new mongoose.Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Use Schema.Types.ObjectId here
  eventId: { type: String, required: true },
});

// Export the model and schema
export const InterestedMemberModel = model<InterestedMember>('InterestedMember', InterestedMemberSchema);
export { InterestedMemberSchema };
