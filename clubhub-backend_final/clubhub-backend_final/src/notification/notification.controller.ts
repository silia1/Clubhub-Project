// src/notification/notification.controller.ts
import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get('user/:recipientId')
    async getUserNotifications(@Param('recipientId') recipientId: string) {
        return await this.notificationService.findByRecipient(recipientId); // No need to convert to number
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return await this.notificationService.markAsRead(id);
    }
}
