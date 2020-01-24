import { ConversationType } from '../interface/conversation.type.enum';

export interface ConversationDto {
    type: ConversationType;
    members: string[];
}
