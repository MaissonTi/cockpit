import { InfraModule } from '@/infra/_infra.module';
import { GetUserUseCase } from './get-user.usecase';
import { DeleteUserUseCase } from './delete-user.usecase';
import { UpdateUserUseCase } from './update-user.usecase';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repositories';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.usecase';
import { ListUserUseCase } from './list-user.usecase';
@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [UserRepository.name, BcryptHasher.name],
      provide: CreateUserUseCase.name,
      useFactory: (
        userRepository: UserRepository,
        bcryptHasher: BcryptHasher,
      ) => new CreateUserUseCase(userRepository, bcryptHasher),
    },
    {
      inject: [UserRepository.name],
      provide: ListUserUseCase.name,
      useFactory: (userRepository: UserRepository) =>
        new ListUserUseCase(userRepository),
    },
    {
      inject: [UserRepository.name],
      provide: UpdateUserUseCase.name,
      useFactory: (userRepository: UserRepository) =>
        new UpdateUserUseCase(userRepository),
    },
    {
      inject: [UserRepository.name],
      provide: DeleteUserUseCase.name,
      useFactory: (userRepository: UserRepository) =>
        new DeleteUserUseCase(userRepository),
    },
    {
      inject: [UserRepository.name],
      provide: GetUserUseCase.name,
      useFactory: (userRepository: UserRepository) =>
        new GetUserUseCase(userRepository),
    },
  ],
  exports: [
    CreateUserUseCase.name,
    ListUserUseCase.name,
    UpdateUserUseCase.name,
    DeleteUserUseCase.name,
    GetUserUseCase.name,
  ],
})
export class UserModule {}
