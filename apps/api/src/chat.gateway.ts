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

interface GroupState {
  bids: Bid[];
  timerActive: boolean;
  timeRemaining: number; // Tempo restante em segundos
  admin: string; // Nome do administrador do grupo
}

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens, ajuste conforme necessário
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Estado dos grupos
  private groups: Record<string, GroupState> = {};

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
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

  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @MessageBody() { group, user }: { group: string; user: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(group);

    // Inicializa o grupo se ainda não existir
    if (!this.groups[group]) {
      this.groups[group] = {
        bids: [],
        timerActive: false,
        timeRemaining: 0,
        admin: user, // O primeiro usuário a criar o grupo torna-se administrador
      };
    }

    // Envia ao cliente os detalhes do grupo
    client.emit('groupJoined', {
      group,
      admin: this.groups[group].admin,
      timerActive: this.groups[group].timerActive,
      timeRemaining: this.groups[group].timeRemaining,
    });

    client.emit('bidsUpdate', this.groups[group].bids); // Envia os lances atuais
    client.emit('timerUpdate', {
      timerActive: this.groups[group].timerActive,
      timeRemaining: this.groups[group].timeRemaining,
    });
  }

  @SubscribeMessage('startTimer')
  handleStartTimer(
    @MessageBody() { group, user }: { group: string; user: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (!this.groups[group]) {
      client.emit('error', 'Grupo não encontrado.');
      return;
    }

    if (this.groups[group].admin !== user) {
      client.emit('error', 'Apenas o administrador pode iniciar o cronômetro.');
      return;
    }

    if (this.groups[group].timerActive) {
      client.emit('error', 'O cronômetro já está ativo.');
      return;
    }

    this.groups[group].timerActive = true;
    this.groups[group].timeRemaining = 30; // 2 minutos

    this.server.to(group).emit('timerUpdate', {
      timerActive: true,
      timeRemaining: 30,
    });

    // Cronômetro
    const interval = setInterval(() => {
      this.groups[group].timeRemaining -= 1;

      // Notifica os clientes com o tempo restante
      this.server.to(group).emit('timerUpdate', {
        timerActive: true,
        timeRemaining: this.groups[group].timeRemaining,
      });

      // Verifica se o tempo acabou
      if (this.groups[group].timeRemaining <= 0) {
        this.groups[group].timerActive = false;
        clearInterval(interval);

        // Determina o vencedor
        const highestBid = this.groups[group].bids.reduce(
          (max, b) => (b.amount > max.amount ? b : max),
          {
            user: 'Ninguém',
            amount: 0,
          },
        );

        // Notifica os membros sobre o vencedor
        this.server.to(group).emit('winnerAnnounced', highestBid);

        this.server.to(group).emit('timerUpdate', {
          timerActive: false,
          timeRemaining: 0,
        });
      }
    }, 1000); // Atualiza a cada segundo
  }

  @SubscribeMessage('bid')
  handleBid(
    @MessageBody() bid: { group: string; user: string; amount: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const { group, user, amount } = bid;

    if (!this.groups[group]) {
      client.emit('error', 'Grupo não encontrado.');
      return;
    }

    if (!this.groups[group].timerActive) {
      client.emit('error', 'Os lances não estão ativos para este grupo.');
      return;
    }

    const highestBid = this.groups[group].bids.reduce(
      (max, b) => Math.max(max, b.amount),
      0,
    );

    if (amount <= highestBid) {
      client.emit(
        'error',
        `O lance deve ser maior que o lance atual de R$ ${highestBid.toFixed(2)}.`,
      );
      return;
    }

    // Adiciona o lance ao grupo
    this.groups[group].bids.push({ user, amount });

    // Atualiza todos os membros do grupo com os lances mais recentes
    this.server.to(group).emit('bidsUpdate', this.groups[group].bids);
  }
}
