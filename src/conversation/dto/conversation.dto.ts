import { ConversationType } from '../interface/conversation.type.enum';

export interface ConversationDto {
    type: ConversationType;
    name?: string;
    members: string[];
    createdBy: string;
}
