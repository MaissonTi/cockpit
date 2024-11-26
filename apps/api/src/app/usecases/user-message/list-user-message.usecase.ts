import { IUserMessageRepository } from '@/domain/protocols/database/repositories/user-message.repository.interface';
import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { IListUserMessageUseCase } from '@/domain/usecases/user-message/list-user-message.usecase.interface';

export class ListUserMessageUseCase implements IListUserMessageUseCase {
  constructor(private readonly userMessageRepository: IUserMessageRepository) {}
  async execute(
    params?: IListUserMessageUseCase.Input,
    pagination?: Pagination,
  ): Promise<IListUserMessageUseCase.Output> {
    return this.userMessageRepository.list(params, pagination);
  }
}
