import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
    ) {}

    // Create a notification for a recipient
    async create(type: string, message: string, recipientId: string) {
        const notification = new this.notificationModel({
            type,
            message,
            recipientId,
            read: false,
        });
        return await notification.save();
    }

    // Find notifications by recipient
    async findByRecipient(recipientId: string) {
        return await this.notificationModel.find({ recipientId, read: false });
    }

    // Mark a notification as read
    async markAsRead(id: string) {
        const notification = await this.notificationModel.findById(id);
        if (notification) {
            notification.read = true;
            return await notification.save();
        }
        return null;
    }
}
