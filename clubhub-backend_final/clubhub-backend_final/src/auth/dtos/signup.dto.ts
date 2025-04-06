/* eslint-disable prettier/prettier */
import { IsEmail, IsString, Matches, MinLength, IsEnum } from 'class-validator';

export class signupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    idCard: string;  // New Field for ID card

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    password: string;

    @IsEnum(['Administrator', 'Member'], { message: 'Role must be either Administrator or Member' })
    role: 'Administrator' | 'Member';  // New Field for role selection
}
