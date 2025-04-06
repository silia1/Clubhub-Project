import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/event.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { InterestedMemberSchema } from 'src/interested-members/schema/interested-members.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: 'InterestedMember', schema: InterestedMemberSchema }, // Use 'InterestedMember' as the name
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), // Export Event model if needed in other modules
  ],
})
export class EventModule {}
