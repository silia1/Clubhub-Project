import { IsNotEmpty, IsString , Matches, MinLength} from 'class-validator';
import { ResetToken } from '../schemas/reset-token.schema';
export  class ResetPasswordDto {
    @IsString()
  readonly ResetToken: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message: 'password must contain at least one number'})
    newPassword: string;    
}