// src/interested-members/interested-members.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestedMemberSchema } from './schema/interested-members.schema';
import { InterestedMembersService } from './interested-members.service';
import { InterestedMembersController } from './interested-members.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { EventModule } from 'src/event/event.module';
import { ClubModule } from 'src/club/club.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'InterestedMember', schema: InterestedMemberSchema }]),
    NotificationModule,
    EventModule, // Import EventModule to access Event model
    ClubModule, // Import ClubModule to access Club model
  ],
  providers: [InterestedMembersService],
  controllers: [InterestedMembersController],
  exports: [InterestedMembersService], // Export if used in other modules
})
export class InterestedMembersModule {}
