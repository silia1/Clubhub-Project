import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from './schemas/club.schema';
import { Application } from './schemas/application.schema';
import { CreateClubDto } from './dto/create-club.dto';
import { NotificationService } from '../notification/notification.service'; // Import NotificationService
import { ManageApplicationDto } from './dto/ManageApplication.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectModel('Club') private readonly clubModel: Model<Club>,
    @InjectModel('Application') private readonly applicationModel: Model<Application>,
    private readonly notificationService: NotificationService, // Inject the NotificationService
  ) {}

   // Create a new club
   async createClub(createClubDto: CreateClubDto): Promise<Club> {
    const { name, description, adminId, numberOfPeople } = createClubDto;

    const createdClub = new this.clubModel({
      name,
      description,
      adminId,
      numberOfPeople,
      currentMembers: 0, // Initialize currentMembers to 0
    });

    return await createdClub.save();
  }

  // Get all clubs (for members to browse all clubs)
  async findAll(): Promise<Club[]> {
    try {
      const clubs = await this.clubModel.find().exec(); // Fetch all clubs
      return clubs;
    } catch (error) {
      console.error('Error fetching clubs:', error); // Log the error on the server
      throw new BadRequestException('Failed to fetch clubs');
    }
  }

  // Get all clubs by a specific adminId
  async findAllByAdmin(adminId: string): Promise<Club[]> {
    return await this.clubModel.find({ adminId }).exec(); // Fetch clubs only created by this admin
  }

  // Find club by ID
  async findById(clubId: string): Promise<Club> {
    return await this.clubModel.findById(clubId).exec();
  }

  // Apply to a club (create a new application)
  async applyToClub(clubId: string, memberId: string, formData: any, cvFilename: string): Promise<Application> {
    const club = await this.clubModel.findById(clubId);

    if (!club) {
      throw new BadRequestException('Club not found');
    }

    // Check if the club is already full
    if (club.currentMembers >= club.numberOfPeople) {
      throw new BadRequestException('Club is already full');
    }

    const newApplication = new this.applicationModel({
      clubId,
      memberId,
      age: formData.age,
      activities: formData.activities,
      experience: formData.experience,
      cvFile: cvFilename,
      status: 'pending',
    });

    try {
      const savedApplication = await newApplication.save();

      // Notify the admin that a new member has applied
      await this.notificationService.create(
        'club_application',
        `Member ${memberId} has applied for club ${club.name}.`,
        club.adminId // Assuming adminId is the recipient ID
      );

      return savedApplication;
    } catch (error) {
      throw new BadRequestException('Failed to save application');
    }
  }

  // Fetch all applications for a specific club
  async getApplicationsByClubId(clubId: string): Promise<Application[]> {
    return await this.applicationModel.find({ clubId }).exec();
  }

  // Manage an application (accept/reject)
  async manageApplication(manageApplicationDto: ManageApplicationDto): Promise<Application> {
    const { applicationId, status } = manageApplicationDto;
    const application = await this.applicationModel.findById(applicationId).exec();

    if (!application) {
      throw new BadRequestException('Application not found');
    }

    application.status = status;

    if (status === 'accepted') {
      // Increment the currentMembers of the club when an application is accepted
      const club = await this.clubModel.findById(application.clubId);
      if (club.currentMembers < club.numberOfPeople) {
        club.currentMembers += 1;
        await club.save();

        // Notify the member that they have been accepted to the club
        await this.notificationService.create(
          'club_accepted',
          `Congratulations! You have been accepted to the club ${club.name}.`,
          application.memberId
        );
      } else {
        throw new BadRequestException('Club is already full');
      }
    }

    return await application.save();
  }
  
  // Fetch accepted members for a specific club
  async findAcceptedMembers(clubId: string): Promise<Application[]> {
    return this.applicationModel.find({ clubId, status: 'accepted' }).exec();
  }

  // Get all accepted members for a specific club
  async getAcceptedMembers(clubId: string): Promise<Application[]> {
    return this.applicationModel.find({ clubId, status: 'accepted' }).exec();
  }

  // Get accepted clubs for a specific member
  async getAcceptedClubsForMember(memberId: string): Promise<Club[]> {
    const acceptedApplications = await this.applicationModel.find({
      memberId,
      status: 'accepted',
    });

    // Get the clubs associated with those applications
    const clubIds = acceptedApplications.map(app => app.clubId);
    return await this.clubModel.find({ _id: { $in: clubIds } }).exec();
  }

  // Update payment status (Optional if you want to notify members)
  async updatePaymentStatus(clubId: string, memberId: string, status: string): Promise<void> {
    const application = await this.applicationModel.findOne({ clubId, memberId });
    if (!application) {
      throw new Error('Application not found');
    }
    application.payment = status;
    await application.save();

    // Optional: Notify the member about the payment status update
    await this.notificationService.create(
      'payment_status',
      `Your payment status has been updated to: ${status}.`,
      memberId
    );
  }
}
