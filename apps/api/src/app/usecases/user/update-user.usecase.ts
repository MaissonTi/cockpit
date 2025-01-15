import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { IUpdateUserUseCase } from '@/domain/usecases/user/update-user.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    id: string,
    data: IUpdateUserUseCase.Input,
  ): Promise<IUpdateUserUseCase.Output> {
    const model = await this.userRepository.find(id);

    if (!model) {
      throw new NotFoundException(`User not found`);
    }

    return this.userRepository.update(id, data);
  }
}
