import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationSchema } from 'src/conversation/conversation.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationSchema } from 'src/notifications/notification.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ckret!walang|clue:p',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    ConversationService,
    NotificationsService,
  ],
})
export class UserModule {}
