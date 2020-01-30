import { Controller, Post, UseGuards, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ConversationDto } from './dto/conversation.dto';
import { ResponseModel } from 'src/shared/interface/response.model';
import { ConversationService } from './conversation.service';
import { MessageDto } from './dto/message.dto';
import { ConversationInterface } from './interface/conversation.interface';
import { MessageInterface } from './interface/message.interface';

@Controller('conversation')
export class ConversationController {

    constructor(
        private srv: ConversationService,
    ) {

    }

    @Get(':id/messages')
    @UseGuards(AuthGuard)
    async getConversationMessages(
        @Param() params,
    ): Promise<ResponseModel<MessageInterface[]>> {
        const convo = await this.srv.getConversationMessages(params.id);

        if (convo) {
            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: convo.messages,
            };
        } else {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Conversation do not exist!',
                data: [],
            };
        }
    }

    @Get(':id/type/:type')
    @UseGuards(AuthGuard)
    async getConversations(
        @Param() params,
    ): Promise<ResponseModel<{
        total: number,
        list: ConversationInterface[],
    }>> {
        const {type, id} = params;
        const convos = await this.srv.getConversations({
            id,
            type,
            search: '',
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: convos,
        };
    }

    @Post('message')
    @UseGuards(AuthGuard)
    async sendMessage(
        @Body() {
            message,
            from,
            conversationId,
        }: MessageDto): Promise<ResponseModel<MessageInterface>> {
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
