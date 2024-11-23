import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { IDeleteUserUseCase } from '@/domain/usecases/user/delete-user.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: string): Promise<void> {
    const result = await this.userRepository.find(id);

    if (!result) {
      throw new NotFoundException(`User not found`);
    }

    await this.userRepository.delete(id);
  }
}
