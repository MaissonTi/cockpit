// src/chat.gateway.ts
import { IUserMessageRepository } from '@/domain/protocols/database/repositories/user-message.repository.interface';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UserMessageModel } from '@repo/domain/models/user-message.model';
import { Server, Socket } from 'socket.io';
import { UserMessageRepository } from '../database/prisma/repositories/user-message.repositories';
import { EnvService } from '../env/env.service';

interface Bid {
  user: string;
  amount: number;
}

type Message = UserMessageModel & {
  username: string;
  timestamp: string;
};

interface GroupState {
  bids: Bid[];
  timerActive: boolean;
  timeRemaining: number; // Tempo restante em segundos
  admin: string; // Nome do administrador do grupo
  users: number; // Contador de usuários
}

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens, ajuste conforme necessário
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @Inject(UserMessageRepository.name)
  private readonly userMessageRepository: IUserMessageRepository;

  constructor(
    private jwtService: JwtService,
    private config: EnvService,
  ) {}

  // Estado dos grupos
  private groups: Record<
    string,
    {
      bids: Bid[];
      timerActive: boolean;
      timeRemaining: number;
      admin: string;
      users: number;
      intervalId?: NodeJS.Timeout; // Referência ao cronômetro do grupo
    }
  > = {};

  async handleConnection(client: Socket) {
    const publicKey = this.config.get('JWT_PUBLIC_KEY');

    try {
      const token = client.handshake.headers.authorization;

      if (!token) {
        throw new WsException('Token não fornecido');
      }

      const decoded = this.jwtService.verify(token, {
        publicKey: publicKey,
        secret: Buffer.from(publicKey, 'base64'),
        algorithms: ['RS256'],
      });

      client.data.user = decoded;
      console.log(`Usuário conectado: ${decoded.username}`);
    } catch (error) {
      console.log('Conexão recusada. Token inválido.');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    messageBody: Message,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client.data.user;
    const group = messageBody.destinateId;
    const message = { ...messageBody, username: user.username } as Message;

    console.log('group', group, 'message', message.content);

    if (!group) {
      client.emit('error', 'Grupo não especificado.');
      return;
    }

    await this.userMessageRepository.create({
      isGroup: true,
      content: message.content,
      userId: message.userId,
      destinateId: group,
    });

    this.server.to(group).emit('message', message);
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @MessageBody() { group, user }: { group: string; user: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const rooms = Array.from(client.rooms);
    for (const room of rooms) {
      if (room !== client.id) {
        client.leave(room);
      }
    }

    client.join(group);

    console.log(`Usuario ${user} entrou no grupo ${group}`);

    if (!this.groups[group]) {
      this.groups[group] = {
        bids: [],
        timerActive: false,
        timeRemaining: 0,
        admin: user,
        users: 0, // Contador de usuários
      };
    }

    this.groups[group].users += 1;

    this.server.to(group).emit('userCountUpdate', this.groups[group].users);

    client.emit('groupJoined', {
      group,
      admin: this.groups[group].admin,
      timerActive: this.groups[group].timerActive,
      timeRemaining: this.groups[group].timeRemaining,
    });

    client.emit('bidsUpdate', this.groups[group].bids);
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

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(
    @MessageBody() group: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!this.groups[group]) {
      return;
    }

    const isAdmin = this.groups[group].admin === client.id;

    if (isAdmin) {
      // Notifica os usuários que o grupo será excluído em 5 segundos
      this.server.to(group).emit('groupWillBeDeleted', { group, timeout: 5 });

      console.log(
        `Administrador saiu do grupo ${group}. O grupo será excluído em 5 segundos.`,
      );

      setTimeout(() => {
        this.server.to(group).emit('groupDeleted', group);
        delete this.groups[group];
        console.log(`Grupo ${group} foi excluído.`);
      }, 5000);
    } else {
      // Remove o cliente do grupo
      client.leave(group);
      this.groups[group].users = Math.max(0, this.groups[group].users - 1);
      this.server.to(group).emit('userCountUpdate', this.groups[group].users);
      console.log(
        `Usuário saiu do grupo: ${group}. Usuários restantes: ${this.groups[group].users}`,
      );
    }
  }

  @SubscribeMessage('pauseTimer')
  handlePauseTimer(
    @MessageBody() { group, user }: { group: string; user: string },
  ): void {
    const groupState = this.groups[group];

    if (!groupState || groupState.admin !== user) {
      return;
    }

    if (!groupState.timerActive) {
      this.server.to(group).emit('timerNotification', {
        message: 'O cronômetro já está pausado.',
      });
      return;
    }

    groupState.timerActive = false;

    if (groupState.intervalId) {
      clearInterval(groupState.intervalId);
      groupState.intervalId = undefined;
    }

    this.server.to(group).emit('timerUpdate', {
      timerActive: false,
      timeRemaining: groupState.timeRemaining,
    });

    this.server
      .to(group)
      .emit('timerNotification', { message: `${user} pausou o cronômetro.` });
  }

  @SubscribeMessage('resumeTimer')
  handleResumeTimer(
    @MessageBody() { group, user }: { group: string; user: string },
  ): void {
    if (!this.groups[group]) {
      return;
    }

    if (this.groups[group].admin !== user) {
      return; // Apenas o administrador pode retomar o cronômetro
    }

    if (this.groups[group].timerActive) {
      return; // Não retoma se o cronômetro já estiver ativo
    }

    this.groups[group].timerActive = true;

    this.server.to(group).emit('timerUpdate', {
      timerActive: true,
      timeRemaining: this.groups[group].timeRemaining,
    });

    const interval = setInterval(() => {
      if (!this.groups[group].timerActive) {
        clearInterval(interval); // Interrompe o cronômetro quando pausado ou parado
        return;
      }

      this.groups[group].timeRemaining -= 1;

      this.server.to(group).emit('timerUpdate', {
        timerActive: true,
        timeRemaining: this.groups[group].timeRemaining,
      });

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

        this.server.to(group).emit('winnerAnnounced', highestBid);

        this.server.to(group).emit('timerUpdate', {
          timerActive: false,
          timeRemaining: 0,
        });
      }
    }, 1000); // Atualiza a cada segundo
  }

  @SubscribeMessage('stopTimer')
  handleStopTimer(
    @MessageBody() { group, user }: { group: string; user: string },
  ): void {
    const groupState = this.groups[group];

    if (!groupState || groupState.admin !== user) {
      return;
    }

    groupState.timerActive = false;
    groupState.timeRemaining = 0;

    if (groupState.intervalId) {
      clearInterval(groupState.intervalId);
      groupState.intervalId = undefined;
    }

    this.server.to(group).emit('timerUpdate', {
      timerActive: false,
      timeRemaining: 0,
    });

    this.server
      .to(group)
      .emit('timerNotification', { message: `${user} parou o cronômetro.` });
  }

  @SubscribeMessage('startTimer')
  handleStartTimer(
    @MessageBody() { group, user }: { group: string; user: string },
  ): void {
    const groupState = this.groups[group];

    if (!groupState || groupState.admin !== user) {
      return;
    }

    if (groupState.timerActive) {
      return;
    }

    groupState.timerActive = true;
    groupState.timeRemaining = 120;

    this.server.to(group).emit('timerUpdate', {
      timerActive: true,
      timeRemaining: groupState.timeRemaining,
    });

    groupState.intervalId = setInterval(() => {
      groupState.timeRemaining -= 1;

      if (groupState.timeRemaining <= 0) {
        clearInterval(groupState.intervalId);
        groupState.intervalId = undefined;
        groupState.timerActive = false;

        this.server.to(group).emit('timerUpdate', {
          timerActive: false,
          timeRemaining: 0,
        });

        this.server
          .to(group)
          .emit('timerNotification', { message: 'O cronômetro terminou.' });
      } else {
        this.server.to(group).emit('timerUpdate', {
          timerActive: true,
          timeRemaining: groupState.timeRemaining,
        });
      }
    }, 1000);
  }
}
