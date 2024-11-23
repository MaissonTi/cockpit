import { Module } from '@nestjs/common';
import { ProcessDisputeModule } from './process-dispute/_process-dispute.module';
import { AuthenticateModule } from './authenticate/_authenticate.module';
import { UserModule } from './user/_user.module';
@Module({
  imports: [UserModule, AuthenticateModule, ProcessDisputeModule],
  providers: [],
  exports: [UserModule, AuthenticateModule, ProcessDisputeModule],
})
export class UseCasesModule {}
