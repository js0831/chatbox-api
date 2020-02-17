import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { NotificationSchema } from './notification.schema';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ckret!walang|clue:p',
      signOptions: { expiresIn: '18h' },
    }),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  controllers: [
    NotificationController,
  ],
  providers: [
    NotificationsService,
  ],
})
export class NotificationsModule {}
