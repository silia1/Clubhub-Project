/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req, NotFoundException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dtos/signup.dto';
import { loginDto } from './dtos/login.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { forgotPasswordDto } from './dtos/forgot-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signup') //auth/signup
  async signUp(@Body() signupData: signupDto) {
    return this.authService.signup(signupData);
  }
  //todo: login post
  @Post('login')
  async login(@Body() credentials: loginDto) {
    return this.authService.login(credentials);
  }
  //todo: REFRESH TOKEN API
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
  //todo:change password
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
){
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword, 
      changePasswordDto.newPassword,
    );
  }

  //todo:forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: forgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
  //reset password
  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.ResetToken,
    )
  }

   // Update user information (PUT)
   // Update user information (PUT)
@Put('users/:id')
async updateUserProfile(@Param('id') userId: string, @Body() updateData: UpdateUserDto) {
  return this.authService.updateUser(userId, updateData); // Call to authService to update user data
}

@Get('users/:id')
async getUserProfile(@Param('id') userId: string) {
  return this.authService.getUserProfile(userId);
}

@Post('upload-profile-image/:userId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile-images',  // Save the images in this directory
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        cb(null, `file-${uniqueSuffix}${ext}`); // Custom file naming
      }
    }),
  }))
  async uploadProfileImage(@Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `http://localhost:4000/uploads/profile-images/${file.filename}`;
    
    // Update user's profile with the image URL
    await this.authService.updateUserProfile(userId, { profileImage: imageUrl });
    
    return { message: 'Profile image uploaded successfully', imageUrl };
  }

  // Fetch user data by ID (to retrieve the avatar URL)
  @Get('users/:userId')
  async getUserById(@Param('userId') userId: string) {
    const user = await this.authService.getUserById(userId);
    return user;
  }
}
