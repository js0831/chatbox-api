import { ConversationType } from './conversation.type.enum';
import { MessageInterface } from './message.interface';
import { UserInterface } from 'src/user/interfaces/user.interface';

export interface ConversationInterface {
    type: ConversationType;
    name?: string;
    members: string[];
    messages: MessageInterface[];
    createdBy?: UserInterface | string;
}
