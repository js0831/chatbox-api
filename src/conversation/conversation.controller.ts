import { Controller, Post, UseGuards, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ConversationDto } from './dto/conversation.dto';
import { ResponseModel } from 'src/shared/interface/response.model';
import { ConversationService } from './conversation.service';
import { MessageDto } from './dto/message.dto';

@Controller('conversation')
export class ConversationController {

    constructor(
        private srv: ConversationService,
    ) {

    }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() {
            members,
        }: ConversationDto): Promise<ResponseModel> {
            const convo = await this.srv.create({members});
            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: convo,
            };
    }

    @Get('id/:ida/:idb')
    @UseGuards(AuthGuard)
    async getConversation(
        @Param() params,
    ): Promise<ResponseModel> {
        const convo = await this.srv.getConversation([params.ida, params.idb]);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: convo,
        };
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getConversationMessages(
        @Param() params,
    ): Promise<ResponseModel> {
        const convo = await this.srv.getConversationMessages(params.id);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: convo,
        };
    }

    @Post('message')
    @UseGuards(AuthGuard)
    async sendMessage(
        @Body() {
            message,
            from,
            conversationId,
        }: MessageDto): Promise<ResponseModel> {
            const msg = await this.srv.sendMessage({
                message,
                from,
                conversationId,
            });
            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: msg,
            };
    }
}
