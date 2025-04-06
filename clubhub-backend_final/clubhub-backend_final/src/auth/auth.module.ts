import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { user, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResetToken, ResetTokenSchema } from './schemas/reset-Token.schema';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: user.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    JwtModule.register({
      secret: 'your-secret-key', // This should be your secret key, use environment variables in production
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, MailService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
