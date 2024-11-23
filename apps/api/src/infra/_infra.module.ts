import { Module } from '@nestjs/common';
import { AuthModule } from './auth/_auth.module';
import { CryptographyModule } from './cryptography/_cryptography.module';
import { DatabaseModule } from './database/_database.module';
import { EnvModule } from './env/env.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    EnvModule,
    AuthModule,
    WebsocketsModule,
  ],
  providers: [],
  exports: [
    DatabaseModule,
    CryptographyModule,
    EnvModule,
    AuthModule,
    WebsocketsModule,
  ],
})
export class InfraModule {}
