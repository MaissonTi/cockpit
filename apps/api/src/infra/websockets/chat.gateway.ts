// src/chat.gateway.ts
import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
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
import { ProcessDisputeRepository } from '../database/prisma/repositories/process-dispute.repository';
import { UserMessageRepository } from '../database/prisma/repositories/user-message.repositories';
import { EnvService } from '../env/env.service';
import { TimerService } from './timer.service';

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

const DEFAULT_TIME = 15; // 1 minuto
const MORE_TIME = 15; // 1 minuto

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

  @Inject(ProcessDisputeRepository.name)
  private readonly processDisputeRepository: IProcessDisputeRepository;

  constructor(
    private jwtService: JwtService,
    private config: EnvService,
    private readonly timerService: TimerService,
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
      console.log(decoded);
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
  async handleJoinGroup(
    @MessageBody() { group, user }: { group: string; user: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const rooms = Array.from(client.rooms);
    for (const room of rooms) {
      if (room !== client.id) {
        client.leave(room);
      }
    }

    client.join(group);

    const { batch } = await this.processDisputeRepository.find(group);

    if (batch.length > 0) {
      batch.map(batch => {
        if (this.timerService.isTimerActive(batch.id)) {
          const remainingTime = this.timerService.getRemainingTime(batch.id);

          this.server.to(group).emit('timerUpdate', {
            timerActive: true,
            timeRemaining: remainingTime,
            batch: batch.id,
          });
        }
      });
    }

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

    this.server.to(group).emit('groupJoined', {
      group,
      admin: this.groups[group].admin,
      timerActive: this.groups[group].timerActive,
      timeRemaining: this.groups[group].timeRemaining,
    });

    this.server.to(group).emit('bidsUpdate', this.groups[group].bids);
  }

  @SubscribeMessage('bid')
  handleBid(
    @MessageBody() bid: { group: string; batch: string; amount: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const user = client.data.user;
    const { group, amount, batch } = bid;

    // const highestBid = this.groups[group].bids.reduce(
    //   (max, b) => Math.max(max, b.amount),
    //   0,
    // );

    // if (amount <= highestBid) {
    //   client.emit(
    //     'error',
    //     `O lance deve ser maior que o lance atual de R$ ${highestBid.toFixed(2)}.`,
    //   );
    //   return;
    // }

    // Adiciona o lance ao grupo
    this.groups[group].bids.push({ user, amount });

    if (this.timerService.getRemainingTime(batch) <= 10) {
      this.handleAddTimeToTimer(
        { group, additionalSeconds: MORE_TIME, batch },
        client,
      );
    }

    this.server.to(group).emit('bidsUpdate', { amount, batch, user });
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

  @SubscribeMessage('startTimer')
  handleStartTimer(
    @MessageBody() { group, batchs }: { group: string; batchs: string[] },
    @ConnectedSocket() client: Socket,
  ): void {
    const user = client.data.user;

    const groupState = this.groups[group];

    if (!groupState || user.role !== 'ADMIN') {
      return;
    }

    try {
      batchs.map(batch => {
        this.server.to(group).emit('timerUpdate', {
          timerActive: true,
          timeRemaining: DEFAULT_TIME,
          batch,
          timeUpdate: false,
        });

        this.timerService.startTimer(
          batch,
          DEFAULT_TIME,
          remainingTime => {
            this.server.to(group).emit('timerUpdate', {
              timerActive: true,
              timeRemaining: remainingTime,
              batch,
              timeUpdate: false,
            });
          },
          () => {
            this.server.to(group).emit('timerUpdate', {
              timerActive: false,
              timeRemaining: 0,
              batch,
              timeUpdate: false,
            });
            this.server.to(group).emit('timerFinished', { group, batch });
          },
        );
      });
    } catch (error) {
      console.error(error);
      //client.emit('error', error.message);
    }
  }

  @SubscribeMessage('pauseTimer')
  handlePauseTimer(
    @MessageBody() { group, batch }: { group: string; batch: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const groupState = this.groups[group];
    const user = client.data.user;

    if (!groupState || user.role !== 'ADMIN') {
      return;
    }

    if (this.timerService.isTimerActive(batch)) {
      const remainingTime = this.timerService.pauseTimer(batch);
      this.server.to(group).emit('timerUpdate', {
        timerActive: false,
        timeRemaining: remainingTime,
        batch,
        timeUpdate: false,
      });

      // this.server
      //   .to(group)
      //   .emit('timerNotification', { message: `${user} pausou o cronômetro.` });
    }
  }

  @SubscribeMessage('resumeTimer')
  handleResumeTimer(
    @MessageBody() { group, batch }: { group: string; batch: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('ENTROU no resumeTimer');

    const user = client.data.user;

    if (!this.groups[group]) {
      return;
    }

    if (!this.groups[group] || user.role !== 'ADMIN') {
      return; // Apenas o administrador pode retomar o cronômetro
    }

    this.timerService.resumeTimer(
      batch,
      remainingTime => {
        this.server.to(group).emit('timerUpdate', {
          timerActive: true,
          timeRemaining: remainingTime,
          batch,
          timeUpdate: false,
        });
      },
      () => {
        this.server
          .to(group)
          .emit('timerUpdate', { timerActive: false, timeRemaining: 0, batch });
        this.server.to(group).emit('timerFinished', { group, batch });
      },
    );
  }

  @SubscribeMessage('stopTimer')
  handleStopTimer(
    @MessageBody() { group, batchs }: { group: string; batchs: string[] },
    @ConnectedSocket() client: Socket,
  ): void {
    const user = client.data.user;

    if (!this.groups[group] || user.role !== 'ADMIN') {
      return;
    }

    batchs.map(batch => {
      this.timerService.stopTimer(batch);

      this.server
        .to(group)
        .emit('timerUpdate', { timerActive: false, timeRemaining: 0, batch });
    });
  }

  @SubscribeMessage('addTimeToTimer')
  handleAddTimeToTimer(
    @MessageBody()
    {
      group,
      additionalSeconds,
      batch,
    }: { group: string; additionalSeconds: number; batch: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const user = client.data.user;

    try {
      this.timerService.addTime(
        batch,
        additionalSeconds,
        (remainingTime, timeUpdate) => {
          this.server.to(group).emit('timerUpdate', {
            timerActive: true,
            timeRemaining: remainingTime,
            batch,
            timeUpdate,
          });
        },
        () => {
          this.server.to(group).emit('timerUpdate', {
            timerActive: false,
            timeRemaining: 0,
            batch,
          });
          this.server.to(group).emit('timerFinished', group);
        },
      );

      // Notifica o grupo que o tempo foi adicionado
      this.server
        .to(group)
        .emit('timeAdded', { additionalSeconds, batch, group });
    } catch (error) {
      console.log(error);
      //client.emit('error', error.message);
    }
  }
}
