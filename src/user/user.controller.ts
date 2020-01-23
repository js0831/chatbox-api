import { Controller, Post, Body, Get, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { ResponseModel } from 'src/shared/interface/response.model';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserInterface } from './interfaces/user.interface';
import { PaginationInterface } from 'src/shared/interface/pagination.interface';

@Controller('user')
export class UserController {

    constructor(
        private srv: UserService,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() {
            accountId,
            firstname,
            lastname,
            email,
            username,
        }: UserDto): Promise<ResponseModel<UserInterface>> {
            let user = await this.srv.findUserByAccountId(accountId);

            if (!user) {
                user = await this.srv.create({
                    accountId,
                    firstname,
                    lastname,
                    email,
                    username,
                });
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: user,
            };
    }

    @Get(':id/:search/:page/:limit')
    @UseGuards(AuthGuard)
    async getUsersWithSearch(
        @Param() params,
    ): Promise<ResponseModel<{
        total: number,
        list: UserInterface[],
    }>> {
        const {
            id,
            page,
            limit,
            search,
        } = params;

        const pagination: PaginationInterface = {
            skip: (limit * page),
            limit: parseInt(limit, 0),
        };

        const users = await this.srv.getUsers({id, search, pagination});
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: users,
        };
    }

    @Post('invite')
    @UseGuards(AuthGuard)
    async invite(
        @Body() {userId, byUserId}: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.invite(userId, byUserId);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Post('invite/cancel')
    @UseGuards(AuthGuard)
    async cancelInvitation(
        @Body() {by, to}: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.cancelInvitation(by, to);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Get(':id/friend/request/:search/:page/:limit')
    @UseGuards(AuthGuard)
    async getFriendRequest(
        @Param() params,
    ): Promise<ResponseModel<{
        total: number,
        list: UserInterface[],
    }>> {
        const {
            id,
            page,
            limit,
            search,
        } = params;

        const pagination: PaginationInterface = {
            skip: (limit * page),
            limit: parseInt(limit, 0),
        };

        const users = await this.srv.getFriendRequest({
            id,
            pagination,
            search,
        });

        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: users,
        };
    }

    @Post('unfriend')
    @UseGuards(AuthGuard)
    async unfriend(
        @Body() {who, by}: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.unfriend(who, by);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Get(':id/friends/:search/:page/:limit')
    @UseGuards(AuthGuard)
    async getFriends(
        @Param() params,
    ): Promise<ResponseModel<{
        total: number,
        list: UserInterface[],
    }>> {
        const {
            id,
            page,
            limit,
            search,
        } = params;

        const pagination: PaginationInterface = {
            skip: (limit * page),
            limit: parseInt(limit, 0),
        };

        const user = await this.srv.getFriends({
            id,
            pagination,
            search,
        });

        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: user,
        };
    }

    @Post('friend/request/:respond')
    @UseGuards(AuthGuard)
    async respondToFriendRequest(
        @Param() params,
        @Body() {by, to}: any,
    ): Promise<ResponseModel<any>> {
        if (params.respond === 'reject') {
            await this.srv.rejectFriendRequest(by, to);
        } else
        if (params.respond === 'accept') {
            await this.srv.acceptFriendRequest(by, to);
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    // constructor(
    //     private srv: UserService,
    //     private conversationService: ConversationService,
    // ) {}

    // @Get(':id/:type')
    // @UseGuards(AuthGuard)
    // async userFriends(
    //     @Param() params,
    // ): Promise<ResponseModel> {
    //     const user = await this.srv.getUserFriends(params.id, params.type);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //         data: user ? user[params.type] : [],
    //     };
    // }

    // @Get(':id/search/:key')
    // @UseGuards(AuthGuard)
    // async search(
    //     @Param() params,
    // ): Promise<ResponseModel> {
    //     const users = await this.srv.search(params.id, params.key);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //         data: users || [],
    //     };
    // }


    // @Post('invite/cancel')
    // @UseGuards(AuthGuard)
    // async cancelInvite(
    //     @Body() {by, to}: any,
    // ): Promise<ResponseModel> {
    //     await this.srv.cancelInvitation(by, to);
    //     await this.srv.rejectFriendRequest(to, by);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //     };
    // }

    // @Post('unfriend')
    // @UseGuards(AuthGuard)
    // async unfriend(
    //     @Body() {conversation, who, by}: any,
    // ): Promise<ResponseModel> {
    //     await this.srv.unfriend(who, by);
    //     await this.conversationService.delete(conversation);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //     };
    // }

    // @Post('request/:action')
    // @UseGuards(AuthGuard)
    // async requestRespond(
    //     @Param() params,
    //     @Body() {by, to}: any,
    // ): Promise<ResponseModel> {

    //     if (params.action === 'reject') {
    //         await this.cancelInvite({by: to, to: by});
    //     } else {
    //         await this.srv.acceptRequest(to, by);
    //     }
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //     };
    // }

    // @Get(':id/request/count')
    // @UseGuards(AuthGuard)
    // async countRequest(
    //     @Param() params,
    // ): Promise<ResponseModel> {
    //     const count = await this.srv.getUserRequestCount(params.id);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
    //         data: count,
    //     };
    // }
}
