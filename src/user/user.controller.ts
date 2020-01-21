import { Controller, Post, Body, Get, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { ResponseModel } from 'src/shared/interface/response.model';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserInterface } from './interfaces/user.interface';

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

    // @Post('invite')
    // @UseGuards(AuthGuard)
    // async invite(
    //     @Body() {by, who}: any,
    // ): Promise<ResponseModel> {
    //     await this.srv.invite(by, who);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'success',
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
