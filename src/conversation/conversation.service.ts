import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationInterface } from './interface/conversation.interface';
import { Model } from 'mongoose';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationType } from './interface/conversation.type.enum';
import * as mongoose from 'mongoose';
import { PaginationInterface } from 'src/shared/interface/pagination.interface';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ConversationService {

    constructor(
        @InjectModel('Conversation') private conversationModel: Model<ConversationInterface>,
    ) {}

    async create(convoDto: ConversationDto): Promise<ConversationInterface> {
        const createdConvo = await new this.conversationModel(convoDto).save();
        return this.conversationModel.populate(createdConvo, 'members');
        // createdConvo;
    }

    async getConversations(params: {
        id: string,
        type: ConversationType,
        search?: string,
    }) {
        const {
            id,
            type,
            search,
        } = params;
        const searchKey = search ? search.trim() : '';
        return this.conversationModel.find({
            type,
            members: { $in: id },
        }, {
            members: {
                firstname: 1,
            },
        }).sort({ updatedAt: -1 }).populate('members', 'firstname lastname').select('type members name createdBy').exec();

        // const query = [
        //     {
        //         $match: {
        //             type,
        //             members: { $in: [mongoose.Types.ObjectId(id)] },
        //         },
        //     },
        // ];
        // const result = await this.conversationModel.aggregate([
        //     {
        //       $facet: {
        //         list: [
        //             ...query,
        //             { $skip: pagination.skip },
        //             { $limit: pagination.limit },
        //         ],
        //         total: [
        //             ...query,
        //             { $count: 'total' },
        //         ],
        //       },
        //     },
        // ]);

        // return {
        //     total: result[0].total.length ? result[0].total[0].total : 0,
        //     list: result[0].list.populate('members'),
        // };
    }

    // async delete(id: string): Promise<any> {
    //     return await this.conversationModel.deleteOne({
    //         _id: id,
    //     });
    // }

    async deleteByMembers(members: string[]): Promise<any> {
        return await this.conversationModel.findOneAndRemove({
            members: { $all: members },
        });
    }

    async getConversationMessages(id: string): Promise<any> {
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

    async sendMessage({message, from, conversationId}: MessageDto): Promise<any> {
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

    async addMember(params: {
        conversation: string, user: string,
    }): Promise<any> {
        return this.conversationModel.updateOne(
            { _id: params.conversation },
            {
                $push:
                {
                    members: params.user,
                },
            },
        );
    }

    async leaveConversation(params: {
        user: string,
        conversation: string,
    }): Promise<any> {
        return this.conversationModel.updateOne(
            { _id: params.conversation },
            {
                $pull:
                {
                    members: params.user,
                },
            },
        );
    }

    async delete(conversation: string): Promise<any> {
        return this.conversationModel.deleteOne({ _id: conversation });
    }
}
