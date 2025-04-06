/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { signupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { user, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt'; // Add this
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-Token.schema';
import { MailService } from './services/mail.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(user.name) private UserModel: Model<user>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
  @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService, // Inject JwtService
    private MailService: MailService, 
  ) {}

  async signup(signupData: signupDto): Promise<UserDocument> {
    const { email, password, name, idCard, role } = signupData;

    // Check if the email is already in use
    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with additional fields (idCard and role)
    const createdUser = await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
      idCard,
      role,
    });

    // Return the full user document
    return createdUser;
  }

  async login(credentials: loginDto) {
    const { email, password } = credentials;
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
  
    // Ensure that the response includes the user's ID
    return {
      message: 'Login successful',
      user: {
        id: user._id, // Make sure the user ID is sent as 'id'
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    };
  }  
  
  
  async changePassword(userId, oldPassword: string, newPassword: string){
    //todo:find the user
    const user = await this.UserModel.findById(userId);
    if(!user){
      throw new NotFoundException('user not found');
    }
    //compare his old password with the password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //change user's password and hash it
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
  }

  async forgotPassword(email: string) {
    // Check if the user exists
    const user = await this.UserModel.findOne({ email });
  
    if (user) {
      // Generate a reset token
      const resetToken = nanoid(64); // Generates a 64-character token string
  
      // Set the expiry date (1 hour from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
  
      // Save the reset token in the database
      await this.ResetTokenModel.create({
        token: resetToken, // Use the generated token string
        userId: user._id,
        expiryDate,
      });
  
      // Generate the reset link using the generated resetToken (lowercase, the string)
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      
      // Debugging: Log the reset token and link to verify correctness
      console.log('Generated resetToken:', resetToken);
      console.log('Generated reset link:', resetLink);
  
      // Send the reset link to the user's email
      await this.MailService.sendPasswordResetEmail(user.email, resetToken); // Pass the correct token string
    }
  
    return { message: 'If this user exists, they will receive an email' };
  }
  
  
  async resetPassword(newPassword: string, ResetToken: string) {
    // Find the reset token in the database
    const token = await this.ResetTokenModel.findOne({
      token: ResetToken, // Use resetToken (the string) here
      expiryDate: { $gte: new Date() }, // Ensure token is not expired
    });
  
    if (!token) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  
    // Find the user by their ID
    const user = await this.UserModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
  
    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  
    // Optionally, delete the reset token after it's used
    await this.ResetTokenModel.findByIdAndDelete(token._id);
  }
  
  

  async refreshTokens(refreshToken: string){
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date()},
    });
    if( !token ){
      throw new UnauthorizedException();
    }
    return this.generateUserTokens(token.userId);
  }


  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string){
    //calculate expiry date 3 DAYS FROM NOW
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne({userId }, { $set: {expiryDate, token }}, {
      upsert: true,
    
    },
  );
  }
// In your auth.service.ts
async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
  const user = await this.UserModel.findById(userId);
  
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Update user fields with the provided data
  if (updateUserDto.name) user.name = updateUserDto.name;
  if (updateUserDto.email) user.email = updateUserDto.email;
  if (updateUserDto.idCard) user.idCard = updateUserDto.idCard;
  if (updateUserDto.role) user.role = updateUserDto.role;

  // Update additional information
  if (updateUserDto.phone) user.phone = updateUserDto.phone;
  if (updateUserDto.address) user.address = updateUserDto.address;
  if (updateUserDto.academicGrade) user.academicGrade = updateUserDto.academicGrade;
  if (updateUserDto.linkedin) user.linkedin = updateUserDto.linkedin;
  if (updateUserDto.instagram) user.instagram = updateUserDto.instagram;

  // Save the updated user document
  await user.save();

  return user;
}
async getUserProfile(userId: string): Promise<UserDocument> {
  const user = await this.UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

async updateUserProfile(userId: string, updateData: Partial<UserDocument>): Promise<UserDocument> {
  const user = await this.UserModel.findById(userId);
  
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Update the profile image or any other fields
  if (updateData.profileImage) {
    user.profileImage = updateData.profileImage;
  }

  await user.save();
  return user;
}
// Get user by ID to fetch user info like the profile image
async getUserById(userId: string): Promise<UserDocument> {
  const user = await this.UserModel.findById(userId).exec();
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

async updateProfileImage(userId: string, profileImageUrl: string): Promise<UserDocument> {
  const user = await this.UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.profileImage = profileImageUrl;
  return user.save();
}

}