import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketsModule {}
