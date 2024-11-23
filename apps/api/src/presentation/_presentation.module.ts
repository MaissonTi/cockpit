import { UseCasesModule } from '@/app/usecases/_usecases.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { HealthController } from './http/controllers/health.controller';
import { UserController } from './http/controllers/user.controller';
import { ProcessDisputeController } from './http/controllers/process-dispute.controller';

@Module({
  imports: [TerminusModule, UseCasesModule],
  controllers: [
    HealthController,
    UserController,
    AuthenticateController,
    ProcessDisputeController,
  ],
  providers: [],
})
export class PresentationModule {}
