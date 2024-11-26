import { InfraModule } from '@/infra/_infra.module';
import { Module } from '@nestjs/common';
import { CreateUserMessageUseCase } from './create-user-message.usecase';
import { ListUserMessageUseCase } from './list-user-message.usecase';
import { UserMessageRepository } from '@/infra/database/prisma/repositories/user-message.repositories';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [UserMessageRepository.name],
      provide: CreateUserMessageUseCase.name,
      useFactory: (userMessageRepository: UserMessageRepository) =>
        new CreateUserMessageUseCase(userMessageRepository),
    },
    {
      inject: [UserMessageRepository.name],
      provide: ListUserMessageUseCase.name,
      useFactory: (userMessageRepository: UserMessageRepository) =>
        new ListUserMessageUseCase(userMessageRepository),
    },
  ],
  exports: [CreateUserMessageUseCase.name, ListUserMessageUseCase.name],
})
export class UserMessageModule {}
