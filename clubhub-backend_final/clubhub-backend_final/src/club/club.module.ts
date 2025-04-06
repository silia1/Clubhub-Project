import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { ClubSchema } from './schemas/club.schema';
import { ApplicationSchema } from './schemas/application.schema'; // Import ApplicationSchema
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Club', schema: ClubSchema }]),
    MongooseModule.forFeature([{ name: 'Application', schema: ApplicationSchema }]), // Register ApplicationSchema
    NotificationModule, 
  ], 
  controllers: [ClubController],
  providers: [ClubService],
  exports: [
    MongooseModule.forFeature([{ name: 'Club', schema: ClubSchema }]), // Export Club model if needed in other modules
  ],
})
export class ClubModule {}
