import { UserMessageModel } from '@repo/domain/models/user-message.model';
import { IUserMessageRepository } from '@/domain/protocols/database/repositories/user-message.repository.interface';
import { ICreateUserMessageUseCase } from '@/domain/usecases/user-message/create-user-message.usecase.interface';

export class CreateUserMessageUseCase implements ICreateUserMessageUseCase {
  constructor(private readonly userMessageRepository: IUserMessageRepository) {}
  async execute(
    data: ICreateUserMessageUseCase.Input,
  ): Promise<UserMessageModel> {
    return this.userMessageRepository.create(data);
  }
}
