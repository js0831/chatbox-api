import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationInterface } from './interface/conversation.interface';
import { Model } from 'mongoose';
import { ConversationDto } from './dto/conversation.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ConversationService {

    constructor(
        @InjectModel('Conversation') private conversationModel: Model<ConversationInterface>,
    ) {}

    async create(convoDto: ConversationDto): Promise<ConversationInterface> {
        const createdConvo = new this.conversationModel(convoDto);
        return await createdConvo.save();
    }

    async delete(id: string): Promise<any> {
        return await this.conversationModel.deleteOne({
            _id: id,
        });
    }

    async getConversation(members: string[]) {
        return this.conversationModel.findOne({ members: { $all: members } }).select('id members').exec();
    }

    async getConversationMessages(id: string) {
        /**
         * TODO: pagination
         */
        return this.conversationModel.findOne({_id: id}, { messages: { $slice: -10 } })
        .populate(
            {
                path: 'messages.from',
                select: 'firstname lastname',
            },
        )
        .exec();
    }

    async sendMessage({message, from, conversationId}: MessageDto) {
        return this.conversationModel.updateOne(
            { _id: conversationId },
            {
                $push:
                {
                    messages: {
                        message,
                        from,
                    },
                },
            },
        );
    }
}
