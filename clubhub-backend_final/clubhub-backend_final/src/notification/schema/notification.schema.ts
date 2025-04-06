import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'notifications' })
export class Notification extends Document {
    @Prop({ required: true })
    type: string; // E.g., "club_application", "event_interest", "club_accepted"

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    recipientId: string; // Admin or Member ID

    @Prop({ default: false })
    read: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
