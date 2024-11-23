import { InfraModule } from '@/infra/_infra.module';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repositories';
import { Module } from '@nestjs/common';
import { AuthenticateUseCase } from './authenticate.usecase';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [UserRepository.name, BcryptHasher.name, JwtEncrypter.name],
      provide: AuthenticateUseCase.name,
      useFactory: (userRepository: UserRepository, bcryptHasher: BcryptHasher, jwtEncrypter: JwtEncrypter) =>
        new AuthenticateUseCase(userRepository, bcryptHasher, jwtEncrypter),
    },
  ],
  exports: [AuthenticateUseCase.name],
})
export class AuthenticateModule {}
