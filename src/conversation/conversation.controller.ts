import { Controller, Post, UseGuards, Body, Get, Param, HttpStatus, Patch, Delete } from '@nestjs/common';
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

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() {
            type,
            name,
            members,
            createdBy,
        }: ConversationDto,
    ): Promise<ResponseModel<ConversationInterface>> {
        const convo = await this.srv.create({
            type,
            name,
            members,
            createdBy,
        });
        return {
            message: '',
            statusCode: HttpStatus.OK,
            data: convo,
        };
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

    @Get(':id/messages/:page/:limit')
    @UseGuards(AuthGuard)
    async getConversationMessagesWithPagination(
        @Param() params,
    ): Promise<ResponseModel<MessageInterface[]>> {
        const pagination = {
            page: parseInt(params.page, 0),
            limit: parseInt(params.limit, 0),
        };
        const convo = await this.srv.getConversationMessages(params.id, pagination);

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

    @Post('react')
    @UseGuards(AuthGuard)
    async react(
        @Body() {
            messageId,
            reaction,
        }: any): Promise<ResponseModel<any>> {
            await this.srv.react({
                messageId,
                reaction,
            });
            return {
                statusCode: HttpStatus.OK,
                message: 'success',
            };
    }

    @Patch('leave')
    @UseGuards(AuthGuard)
    async leaveConversation(
        @Body() {
            user,
            conversation,
        }: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.leaveConversation({
            user,
            conversation,
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Patch('rename')
    @UseGuards(AuthGuard)
    async rename(
        @Body() {
            id,
            name,
        }: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.rename(id, name);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Patch('member')
    @UseGuards(AuthGuard)
    async addMember(
        @Body() {
            user,
            conversation,
        }: any,
    ): Promise<ResponseModel<any>> {
        await this.srv.addMember({
            user,
            conversation,
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Delete(':conversation')
    @UseGuards(AuthGuard)
    async deleteConversation(
        @Param() params,
    ): Promise<ResponseModel<any>> {
        await this.srv.delete(params.conversation);
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }
}
