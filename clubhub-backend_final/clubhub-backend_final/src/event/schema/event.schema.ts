import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  place: string;

  @Prop({ required: true })
  clubId: string;

  
 // Ajouter cette ligne pour l'URL de l'image
}
export const EventSchema = SchemaFactory.createForClass(Event);