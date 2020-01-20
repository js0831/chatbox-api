import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserInterface } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<UserInterface>,
    ) {}

    async findUserByAccountId(id: string): Promise<UserInterface> {
        return await this.userModel.findOne({ accountId: id })
        .exec();
    }

    async getUserFriends(id: string, type: string): Promise<UserInterface> {
        return await this.userModel.findOne({ _id: id }).select(type).populate(type)
        .exec();
    }

    async search(id: string, key: string): Promise<UserInterface> {

        let query = {
            _id: {$ne: id},
            friends: { $nin: id },
            invitations: { $nin: id },
            confirmations: { $nin: id },
        };

        if ( key.trim().length > 0 ) {
            query = {
                ...query,
                ...{
                    $or : [
                        { email: { $regex: key, $options: 'i' } },
                        { firstname: { $regex: key, $options: 'i' } },
                        { lastname: { $regex: key, $options: 'i' } },
                    ],
                },
            };
        }

        return await this.userModel.find(query).select('id firstname lastname email username').limit(10)
        .exec();
    }

    async create(createUserDto: UserDto): Promise<UserInterface> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async invite(by: string, who: string) {
        await this.userModel.updateOne(
            { _id: by },
            { $push: { invitations: who }},
        );
        await this.userModel.updateOne(
            { _id: who },
            { $push: { confirmations: by }},
        );
    }

    async cancelInvitation(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: by },
            { $pull: { invitations: to }},
        );
    }

    async rejectFriendRequest(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: by },
            { $pull: { confirmations: to }},
        );
    }

    async acceptRequest(by: string, to: string) {
        await this.userModel.updateOne(
            { _id: to },
            {
                $pull: { confirmations: by },
                $push: { friends: by },
            },
        );

        await this.userModel.updateOne(
            { _id: by },
            {
                $pull: { invitations: to },
                $push: { friends: to },
            },
        );
    }

    async getUserRequestCount(userId: string) {
        const result = await this.userModel.findOne({ _id: userId }).select('invitations confirmations').exec();
        return (result.invitations.length) + (result.confirmations.length);
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
}
