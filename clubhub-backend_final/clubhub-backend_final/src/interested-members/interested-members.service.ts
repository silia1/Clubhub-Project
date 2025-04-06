// src/interested-members/interested-members.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterestedMember } from './schema/interested-members.schema';
import { NotificationService } from '../notification/notification.service';
import { Event, EventDocument } from '../event/schema/event.schema';
import { Club } from '../club/schemas/club.schema'; // Import the Club schema interface

@Injectable()
export class InterestedMembersService {
  constructor(
    @InjectModel('InterestedMember') private interestedMemberModel: Model<InterestedMember>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>, // Inject Event model to get event details
    @InjectModel('Club') private clubModel: Model<Club>, // Inject Club model to get club details
    private notificationService: NotificationService // Inject NotificationService
  ) {}

  // Mark a member as interested in an event
  async markAsInterested(memberId: string, eventId: string): Promise<InterestedMember> {
    // Create and save the interested member
    const interestedMember = new this.interestedMemberModel({ memberId, eventId });
    await interestedMember.save();

    // Fetch event details to get the associated clubId
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new Error('Event not found'); // Handle case where the event doesn't exist
    }

    // Assuming the event has a `clubId` field that references the club
    const club = await this.clubModel.findById(event.clubId).exec();
    if (!club) {
      throw new Error('Club not found'); // Handle case where the club doesn't exist
    }

    // Check if `adminId` is present on the club
    if (!club.adminId) {
      throw new Error(`Admin ID not found for club with ID ${event.clubId}`); // Handle missing adminId in club
    }

    // Notify the admin/organizer about the new interested member
    await this.notificationService.create(
      'new_interest',
      `Member ${memberId} is interested in your event "${event.name}".`,
      club.adminId // Get the `adminId` from the club document
    );

    return interestedMember;
  }
}
