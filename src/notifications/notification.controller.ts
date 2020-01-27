import { Controller, Post, UseGuards, HttpStatus, Body, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ResponseModel } from 'src/shared/interface/response.model';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationInterface } from './interface/notification.interface';

@Controller('notification')
export class NotificationController {

    constructor(
        private notifService: NotificationsService,
    ) {

    }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() {
            user,
            type,
            reference,
            message,
        }: NotificationDTO,
    ): Promise<ResponseModel<NotificationInterface>> {
        const notif = await this.notifService.create({
            user,
            type,
            reference,
            message,
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: notif,
        };
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getNotif(
        @Param() params,
    ): Promise<ResponseModel<NotificationInterface[]>> {
        const notifs = await this.notifService.getList(params.id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: notifs,
        };
    }

    // @Post('clear')
    // @UseGuards(AuthGuard)
    // async clearNotif(
    //     @Body() {
    //         conversation,
    //         from,
    //         member,
    //     }: any,
    // ): Promise<ResponseModel> {
    //     await this.notifService.clearMessageNotification(conversation, from, member);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'Success',
    //     };
    // }

}
