import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { timingSafeEqual } from 'crypto';
import { Socket } from 'dgram';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;

    async handleConnection() {

        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    async handleDisconnect() {
        // A client has disconnected
        this.users--;
        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    @SubscribeMessage('chat')
    async onChat(client, payload) {
        client.broadcast.emit(`chat-${payload.id}`, payload.data);
    }

    @SubscribeMessage('typing')
    async onTyping(client, payload) {
        client.broadcast.emit(`typing-${payload.id}`, payload.who);
    }

    @SubscribeMessage('request')
    async onRequest(client, payload) {
        client.broadcast.emit(`request-${payload.to}`, payload);
    }

    @SubscribeMessage('event')
    async onEvent(client, payload) {
        client.broadcast.emit(`event-${payload.to}`, payload.data);
    }
}
