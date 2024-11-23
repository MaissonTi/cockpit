import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { IListUserUseCase } from '@/domain/usecases/user/list-user.usecase.interface';

export class ListUserUseCase implements IListUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(params?: IListUserUseCase.Input, pagination?: Pagination): Promise<IListUserUseCase.Output> {
    return this.userRepository.list(params, pagination);
  }
}
