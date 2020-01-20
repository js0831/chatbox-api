import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessageNotificationInterface } from './interface/message-notification.interface';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel('MessageNotification') private msgNotification: Model<MessageNotificationInterface>,
    ) {

    }

    async create(msgNotif: MessageNotificationInterface): Promise<MessageNotificationInterface> {
        return await new this.msgNotification(msgNotif).save();
    }

    async getMessageNotifications(conversation: string, from: string, member: string): Promise<MessageNotificationInterface[]> {
        const notifs = await this.msgNotification.find({
            conversation,
            from,
            members: { $in: member },
        }).exec();
        return notifs;
    }

    async clearMessageNotification(conversation: string, from: string, member: string) {
        await this.msgNotification.updateMany(
            {
                conversation,
                from,
            },
            { $pull: { members: member }},
            { new: true},
        );
        await this.msgNotification.deleteMany({ 'members.0': { $exists: false } });
    }
}
