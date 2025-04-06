import { Controller, Post, Get, Param, Body, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { ManageApplicationDto } from './dto/ManageApplication.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  // Create a new club
  @Post('create')
  async createClub(@Body() createClubDto: CreateClubDto) {
    return await this.clubService.createClub(createClubDto);
  }

  // Get all clubs without any filtering (for members to browse all clubs)
  @Get()
  async findAll() {
    return await this.clubService.findAll(); // Fetch all clubs without any filtering
  }

  // Get all clubs created by this admin
  @Get('admin')
  async findAllByAdmin(@Query('adminId') adminId: string) {
    return await this.clubService.findAllByAdmin(adminId);
  }

  // Get club by ID
  @Get(':clubId')
  async findById(@Param('clubId') clubId: string) {
    return await this.clubService.findById(clubId);
  }

  // Apply to a club with file upload (CV)
  @Post(':clubId/apply')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async applyToClub(
    @Param('clubId') clubId: string,
    @Body() applicationData: any,
    @UploadedFile() cvFile: Express.Multer.File,
  ) {
    if (!applicationData || !applicationData.age || !applicationData.activities || !applicationData.experience) {
      throw new BadRequestException('Missing required fields');
    }

    return this.clubService.applyToClub(clubId, applicationData.memberId, {
      age: applicationData.age,
      activities: applicationData.activities,
      experience: applicationData.experience,
    }, cvFile.filename);
  }

  // Fetch all applications for a specific club
  // Get applications for a specific club
  @Get(':clubId/applications')
  async getApplications(@Param('clubId') clubId: string) {
    console.log(`Fetching applications for clubId: ${clubId}`); // Add logging
    return await this.clubService.getApplicationsByClubId(clubId);
  }
  // Manage an application (accept/reject by admin)
  @Post('manage-application')
  async manageApplication(@Body() manageApplicationDto: ManageApplicationDto) {
    return await this.clubService.manageApplication(manageApplicationDto);
  }
  
  // Fetch accepted members for a specific club
  @Get(':clubId/accepted-members')
  async getAcceptedMembers(@Param('clubId') clubId: string) {
    return await this.clubService.findAcceptedMembers(clubId);
  }
  
  // In club.controller.ts
@Get(':userId/members')
async getClubsAndAcceptedMembers(@Param('userId') userId: string) {
  const clubs = await this.clubService.findAllByAdmin(userId); // Get all clubs by this admin

  // Fetch accepted members for each club
  // Fetch accepted members for each club
// Fetch accepted members for each club
const clubsWithMembers = await Promise.all(
  clubs.map(async (club) => {
    const acceptedMembers = await this.clubService.getAcceptedMembers(club._id.toString()); // Convert _id to string
    return {
      ...club.toObject(), // Convert the club document to a plain JS object
      acceptedMembers,
    };
  })
);

  return clubsWithMembers;
}

// club.controller.ts
@Get('members/:memberId/accepted-clubs')
async getAcceptedClubsForMember(@Param('memberId') memberId: string) {
  return await this.clubService.getAcceptedClubsForMember(memberId);
}
//payment
// club.controller.ts
@Post(':clubId/pay')
async payMembership(@Param('clubId') clubId: string, @Body() { userId, amount }: any) {
  // Process payment logic here...

  // After successful payment, update the payment status
  await this.clubService.updatePaymentStatus(clubId, userId, 'yes');
  return { message: 'Payment successful and updated' };
}



}
