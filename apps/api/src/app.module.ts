import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [LinksModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
