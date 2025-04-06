import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInterestedMemberDto {
    @IsString()
    @IsNotEmpty()
    memberId: string;

    @IsString()
    @IsNotEmpty()
    eventId: string;
}
