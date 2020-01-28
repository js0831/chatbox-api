import { NotificationType } from './notification-type.enum';

export interface NotificationInterface {
    user: string;
    type: NotificationType;
    reference: string;
    message: string;
}
