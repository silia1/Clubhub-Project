import { PartialType } from '@nestjs/mapped-types';
import { CreateInterestedMemberDto } from './create-interested-member.dto';

export class UpdateInterestedMemberDto extends PartialType(CreateInterestedMemberDto) {}
