import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { PresentationModule } from './presentation/_presentation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
