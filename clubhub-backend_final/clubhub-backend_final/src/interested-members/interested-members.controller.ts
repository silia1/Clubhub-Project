// src/interested-members/interested-members.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { InterestedMembersService } from './interested-members.service';

@Controller('interested-members')
export class InterestedMembersController {
  constructor(private readonly interestedMembersService: InterestedMembersService) {}

  @Post('mark-as-interested')
  async markAsInterested(@Body() body: { memberId: string; eventId: string }) {
    const { memberId, eventId } = body;
    return await this.interestedMembersService.markAsInterested(memberId, eventId);
  }
}
