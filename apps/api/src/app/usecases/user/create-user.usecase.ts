import { UserRoleEnum } from '@/domain/enum/user-roles.enum';
import { UserModel } from '@/domain/models/user.model';
import { IBcryptHasher } from '@/domain/protocols/cryptography/bcrypt-hasher.interface';
import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { ICreateUserUseCase } from '@/domain/usecases/user/create-user.usecase.interface';
import { BadRequestException } from '@nestjs/common';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptHasher: IBcryptHasher,
  ) {}
  async execute(data: ICreateUserUseCase.Input): Promise<UserModel> {
    const exists = await this.userRepository.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException(
        `User already exists with this email ${data.email}.`,
      );
    }

    const hashedPassword = await this.bcryptHasher.hash(data.password);

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: UserRoleEnum.COMMON,
    });
  }
}
