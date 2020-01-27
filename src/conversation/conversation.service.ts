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
        const createdConvo = new this.conversationModel(convoDto);
        return await createdConvo.save();
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
        }).populate('members', 'firstname lastname').select('type members').exec();

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

    // async getConversationMessages(id: string) {
    //     /**
    //      * TODO: pagination
    //      */
    //     return this.conversationModel.findOne({_id: id}, { messages: { $slice: -10 } })
    //     .populate(
    //         {
    //             path: 'messages.from',
    //             select: 'firstname lastname',
    //         },
    //     )
    //     .exec();
    // }

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
