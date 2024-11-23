import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { IGetUserUseCase } from '@/domain/usecases/user/get-user.usecase.interface';

export class GetUserUseCase implements IGetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: string): Promise<IGetUserUseCase.Output> {
    return await this.userRepository.find(id);
  }
}
