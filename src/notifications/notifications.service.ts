import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationInterface } from './interface/notification.interface';
import { Model } from 'mongoose';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationType } from './interface/notification-type.enum';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel('Notification') private notification: Model<NotificationInterface>,
    ) {

    }

    async create(msgNotif: NotificationDTO): Promise<NotificationInterface> {
        return await new this.notification(msgNotif).save();
    }

    async getList(id: string): Promise<NotificationInterface[]> {
        return await this.notification.find({
            user: id,
        }).exec();
    }

    async deleteNotificationByReference(params: {
        id: string,
        reference: string,
    }) {
        const { id, reference } = params;
        await this.notification.deleteMany({
            user: id,
            reference,
        });
    }

    async seenNotifications(userId: string) {
        await this.notification.updateMany({
            user: userId,
        }, {
            seen: true,
        });
    }
    // async getMessageNotifications(conversation: string, from: string, member: string): Promise<MessageNotificationInterface[]> {
    //     const notifs = await this.msgNotification.find({
    //         conversation,
    //         from,
    //         members: { $in: member },
    //     }).exec();
    //     return notifs;
    // }

    // async clearMessageNotification(conversation: string, from: string, member: string) {
    //     await this.msgNotification.updateMany(
    //         {
    //             conversation,
    //             from,
    //         },
    //         { $pull: { members: member }},
    //         { new: true},
    //     );
    //     await this.msgNotification.deleteMany({ 'members.0': { $exists: false } });
    // }
}
