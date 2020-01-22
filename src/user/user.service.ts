import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserInterface } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from 'src/shared/interface/pagination.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<UserInterface>,
    ) {}

    async findUserByAccountId(id: string): Promise<UserInterface> {
        return await this.userModel.findOne({ accountId: id }).select(`
            firstname
            lastname
            email
            username
        `).exec();
    }

    async create(createUserDto: UserDto): Promise<UserInterface> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    /**
     * Get user list
     * not friend, not yet invited, no you
     */
    async getUsers(id: string, pagination: PaginationInterface) {

        const query = [
            {
                $match: {
                    _id: { $ne: mongoose.Types.ObjectId(id) },
                    friends: { $nin: [id] },
                    friendRequest: { $nin: [id] },
                    invites: { $nin: [id] },
                },
            },
        ];
        const result = await this.userModel.aggregate([
            {
              $facet: {
                list: [
                    ...query,
                    { $skip: pagination.skip },
                    { $limit: pagination.limit },
                ],
                total: [
                    ...query,
                    { $count: 'total' },
                ],
              },
            },
        ]);

        return {
            total: result[0].total[0].total,
            list: result[0].list,
        };

        // return await this.userModel.find({
        //     _id: { $ne: id },
        //     friends: { $nin: id },
        //     friendRequest: { $nin: id },
        //     invites: { $nin: id },
        // })
        // .skip(pagination.skip)
        // .limit(pagination.limit)
        // .select(`
        //     firstname
        //     lastname
        //     email
        //     username
        // `).exec();
    }

    /**
     * TODO: CREATE WITH PAGINATION
     */
    async getFriends(id: string) {
        return await this.userModel.find({
            _id: id,
        }).populate('friends').select(`
            friends
        `).exec();
    }

    async invite(userId: string, byUserID: string) {
        await this.userModel.updateOne(
            { _id: userId },
            { $push: { friendRequest: byUserID }},
        );
        await this.userModel.updateOne(
            { _id: byUserID },
            { $push: { invites: userId }},
        );
    }

    /**
     * TODO: CREATE WITH PAGINATION
     */
    async getFriendRequest(id: string) {
        return await this.userModel.find({
            _id: { $ne: id },
            $or: [
                {friendRequest: { $in: id }},
                {invites: { $in: id }},
            ],
        }).select(`
            firstname
            lastname
            email
            username
            invites
        `).exec();
    }

    async cancelInvitation(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: by },
            { $pull: { invitations: to }},
        );
        await this.userModel.updateOne(
            { _id: to },
            { $pull: { friendRequest: by }},
        );
    }

    async rejectFriendRequest(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: by },
            { $pull: { invites: to }},
        );

        await this.userModel.updateOne(
            { _id: to },
            { $pull: { friendRequest: by }},
        );
    }

    async acceptFriendRequest(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: to },
            {
                $pull: { friendRequest: by },
                $push: { friends: by },
            },
        );

        await this.userModel.updateOne(
            { _id: by },
            {
                $pull: { invites: to },
                $push: { friends: to },
            },
        );
    }

    async unfriend(who: string, by: string) {
        await this.userModel.updateOne(
            {
                _id: by,
            }, {
                $pull: { friends: who },
            },
        );
        await this.userModel.updateOne(
            {
                _id: who,
            }, {
                $pull: { friends: by },
            },
        );
    }

    // async getUserFriends(id: string, type: string): Promise<UserInterface> {
    //     return await this.userModel.findOne({ _id: id }).select(type).populate(type)
    //     .exec();
    // }

    // async search(id: string, key: string): Promise<UserInterface> {

    //     let query = {
    //         _id: {$ne: id},
    //         friends: { $nin: id },
    //         invitations: { $nin: id },
    //         confirmations: { $nin: id },
    //     };

    //     if ( key.trim().length > 0 ) {
    //         query = {
    //             ...query,
    //             ...{
    //                 $or : [
    //                     { email: { $regex: key, $options: 'i' } },
    //                     { firstname: { $regex: key, $options: 'i' } },
    //                     { lastname: { $regex: key, $options: 'i' } },
    //                 ],
    //             },
    //         };
    //     }

    //     return await this.userModel.find(query).select('id firstname lastname email username').limit(10)
    //     .exec();
    // }




    // async getUserRequestCount(userId: string) {
    //     const result = await this.userModel.findOne({ _id: userId }).select('invitations confirmations').exec();
    //     return (result.invitations.length) + (result.confirmations.length);
    // }

    
}
