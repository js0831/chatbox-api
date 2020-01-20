import { Module } from '@nestjs/common';
import { MessageNotificationController } from './message-notification/message-notification.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageNotificationSchema } from './schema/message-notification.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ckret!walang|clue:p',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: 'MessageNotification', schema: MessageNotificationSchema },
    ]),
  ],
  controllers: [
    MessageNotificationController,
  ],
  providers: [
    NotificationsService,
  ],
})
export class NotificationsModule {}
