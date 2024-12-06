import { UseCasesModule } from '@/app/usecases/_usecases.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { BatchController } from './http/controllers/batch.controller';
import { HealthController } from './http/controllers/health.controller';
import { ProcessDisputeController } from './http/controllers/process-dispute.controller';
import { UserMessageController } from './http/controllers/user-message.controller';
import { UserController } from './http/controllers/user.controller';

@Module({
  imports: [TerminusModule, UseCasesModule],
  controllers: [
    HealthController,
    UserController,
    AuthenticateController,
    ProcessDisputeController,
    UserMessageController,
    BatchController,
  ],
  providers: [],
})
export class PresentationModule {}
