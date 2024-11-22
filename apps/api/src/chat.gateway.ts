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

interface Bid {
  user: string;
  amount: number;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens, ajuste conforme necessário
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Armazena lances por grupo
  private bids: Record<string, Bid[]> = {};

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

    // Envia os lances atuais do grupo ao cliente
    client.emit('bidsUpdate', this.bids[group] || []);
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

  @SubscribeMessage('bid')
  handleBid(
    @MessageBody() bid: { group: string; user: string; amount: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const { group, user, amount } = bid;

    if (!group) {
      client.emit('error', 'Grupo não especificado.');
      return;
    }

    if (amount <= 0) {
      client.emit('error', 'O lance deve ser maior que zero.');
      return;
    }

    // Adiciona o lance ao grupo
    if (!this.bids[group]) {
      this.bids[group] = [];
    }
    this.bids[group].push({ user, amount });

    // Atualiza todos os membros do grupo com os lances mais recentes
    this.server.to(group).emit('bidsUpdate', this.bids[group]);
  }
}
