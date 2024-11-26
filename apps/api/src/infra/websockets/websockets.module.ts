import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/_database.module';
import { UserMessageRepository } from '../database/prisma/repositories/user-message.repositories';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketsModule {}
