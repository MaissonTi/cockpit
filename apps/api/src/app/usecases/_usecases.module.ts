import { Module } from '@nestjs/common';
import { AuthenticateModule } from './authenticate/_authenticate.module';
import { BatchBidsModule } from './batch-bids/_batch-bids.module';
import { BatchModule } from './batch/_batch.module';
import { ProcessDisputeModule } from './process-dispute/_process-dispute.module';
import { UserMessageModule } from './user-message/_user-message.module';
import { UserModule } from './user/_user.module';
@Module({
  imports: [
    UserModule,
    AuthenticateModule,
    ProcessDisputeModule,
    UserMessageModule,
    BatchModule,
    BatchBidsModule,
  ],
  providers: [],
  exports: [
    UserModule,
    AuthenticateModule,
    ProcessDisputeModule,
    UserMessageModule,
    BatchModule,
    BatchBidsModule,
  ],
})
export class UseCasesModule {}
