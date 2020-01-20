import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationSchema } from 'src/conversation/conversation.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ckret!walang|clue:p',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Conversation', schema: ConversationSchema },
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    ConversationService,
  ],
})
export class UserModule {}
