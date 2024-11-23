import { IBcryptHasher } from '@/domain/protocols/cryptography/bcrypt-hasher.interface';
import { IJwtEncrypter } from '@/domain/protocols/cryptography/jwt-encrypter.interface';
import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import { IAuthenticateUseCase } from '@/domain/usecases/authenticate/authenticate.usecase.interface';
import { BadRequestException } from '@nestjs/common';

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptHasher: IBcryptHasher,
    private readonly jwtEncrypter: IJwtEncrypter,
  ) {}
  async execute({
    email,
    password,
  }: IAuthenticateUseCase.Input): Promise<IAuthenticateUseCase.Output> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(`Credentials are not valid`);
    }

    const isPasswordValid = await this.bcryptHasher.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Credentials are not valid');
    }

    const accessToken = await this.jwtEncrypter.encrypt({
      sub: user.id.toString(),
      username: user.name,
      role: user.role,
    });

    return {
      user: { name: user.name, email: user.email },
      access_token: accessToken,
    };
  }
}
