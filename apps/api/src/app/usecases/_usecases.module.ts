import { Module } from '@nestjs/common';
import { AuthenticateModule } from './authenticate/_authenticate.module';
import { UserModule } from './user/_user.module';
@Module({
  imports: [UserModule, AuthenticateModule],
  providers: [],
  exports: [UserModule, AuthenticateModule],
})
export class UseCasesModule {}
