import { Module } from '@nestjs/common';
import { AuthModule } from './auth/_auth.module';
import { CryptographyModule } from './cryptography/_cryptography.module';
import { DatabaseModule } from './database/_database.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule, AuthModule],
  providers: [],
  exports: [DatabaseModule, CryptographyModule, EnvModule, AuthModule],
})
export class InfraModule {}
