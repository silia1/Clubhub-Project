import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Event, EventDocument } from './schema/event.schema';
import { InterestedMember } from 'src/interested-members/schema/interested-members.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel('InterestedMember') private interestedMemberModel: Model<InterestedMember>, // Ensure model name matches schema registration
  ) {}

  // Method to create a new event
  async create(createEventDto: any): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    const event = await createdEvent.save();
    return event;
  }

  // Method to find all events, optionally filtered by clubId
  async findAll(clubId?: string): Promise<Event[]> {
    if (clubId) {
      return this.eventModel.find({ clubId }).exec(); // Get events for a specific club
    }
    return this.eventModel.find().exec(); // Get all events
  }

  // Method to delete an event by ID
  async deleteEvent(eventId: string): Promise<Event | null> {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error('Invalid event ID format');
    }

    // Find and delete the event
    const deletedEvent = await this.eventModel.findByIdAndDelete(eventId).exec();

    // Return null if the event doesn't exist
    if (!deletedEvent) {
      return null;
    }

    // Return the deleted event (including its date)
    return deletedEvent;
  }

  // Fetch interested members for a specific event
  async getInterestedMembersByEvent(eventId: string): Promise<InterestedMember[]> {
    const interestedMembers = await this.interestedMemberModel
      .find({ eventId })
      .populate('memberId', 'name') // Populate memberId with User's name field
      .exec();

    return interestedMembers;
  }
}
