import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubModule } from './club/club.module';
import { EventModule } from './event/event.module';
import { InterestedMembersModule } from './interested-members/interested-members.module';
import { UserSchema } from './auth/schemas/user.schema'; // Adjusted to correct path
import { NotificationModule } from './notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/AuthExampleDB'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register the User model
    AuthModule,
    ClubModule,
    EventModule,
    InterestedMembersModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
