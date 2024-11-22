// src/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens, ajuste conforme necessário
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @MessageBody() group: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(group); // Adiciona o cliente a uma sala específica
    client.emit('groupJoined', group); // Confirmação para o cliente
    console.log(`Cliente ${client.id} entrou no grupo: ${group}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: { group: string; user: string; text: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { group, user, text } = message;

    if (!group) {
      client.emit('error', 'Grupo não especificado.');
      return;
    }

    // Envia a mensagem apenas para os membros da sala
    this.server.to(group).emit('message', { user, text });
  }
}
