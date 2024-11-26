import { Module } from '@nestjs/common';
import { ProcessDisputeModule } from './process-dispute/_process-dispute.module';
import { AuthenticateModule } from './authenticate/_authenticate.module';
import { UserModule } from './user/_user.module';
import { UserMessageModule } from './user-message/_user-message.module';
@Module({
  imports: [
    UserModule,
    AuthenticateModule,
    ProcessDisputeModule,
    UserMessageModule,
  ],
  providers: [],
  exports: [
    UserModule,
    AuthenticateModule,
    ProcessDisputeModule,
    UserMessageModule,
  ],
})
export class UseCasesModule {}
