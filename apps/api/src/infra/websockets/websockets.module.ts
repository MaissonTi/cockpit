import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/_database.module';
import { EnvModule } from '../env/env.module';
import { ChatGateway } from './chat.gateway';
import { TimerService } from './timer.service';

@Module({
  imports: [EnvModule, DatabaseModule, ScheduleModule.forRoot()],
  providers: [ChatGateway, TimerService],
  exports: [ChatGateway],
})
export class WebsocketsModule {}
