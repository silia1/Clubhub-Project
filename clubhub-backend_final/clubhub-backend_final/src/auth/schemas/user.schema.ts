import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the User schema extending the Mongoose Document
@Schema()
export class user {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  idCard: string; // Add the ID card field

  @Prop({ required: true })
  role: string; // Add the role field (e.g., Administrator or Member)

  @Prop() 
  phone?: string; // Add optional phone field

  @Prop() 
  address?: string; // Add optional address field

  @Prop() 
  academicGrade?: string; // Add optional academic grade field

  @Prop() 
  linkedin?: string; // Add optional LinkedIn field

  @Prop() 
  instagram?: string; // Add optional Instagram field
  @Prop()
  profileImage: string; // Add profile image field
}

// Define the Mongoose document type for User
export type UserDocument = user & Document;

// Generate the Mongoose schema
export const UserSchema = SchemaFactory.createForClass(user);
