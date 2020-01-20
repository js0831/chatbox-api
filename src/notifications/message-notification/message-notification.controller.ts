import { Controller, Post, UseGuards, HttpStatus, Body, Get, Param } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ResponseModel } from 'src/shared/interface/response.model';
import { MessageNotificationInterface } from '../interface/message-notification.interface';

@Controller('message-notification')
export class MessageNotificationController {

    constructor(
        private notifService: NotificationsService,
    ) {

    }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() {
            conversation,
            from,
            members,
        }: MessageNotificationInterface,
    ): Promise<ResponseModel> {
        const notif = await this.notifService.create({conversation, from, members});
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: notif,
        };
    }

    @Get(':conversation/:from/:member')
    @UseGuards(AuthGuard)
    async getNotif(
        @Param() params,
    ): Promise<ResponseModel> {
        const notifs = await this.notifService.getMessageNotifications(params.conversation, params.from, params.member);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: notifs,
        };
    }

    @Post('clear')
    @UseGuards(AuthGuard)
    async clearNotif(
        @Body() {
            conversation,
            from,
            member,
        }: any,
    ): Promise<ResponseModel> {
        await this.notifService.clearMessageNotification(conversation, from, member);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
        };
    }

}
