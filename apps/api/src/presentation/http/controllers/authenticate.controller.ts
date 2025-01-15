import { AuthenticateUseCase } from '@/app/usecases/authenticate/authenticate.usecase';
import { IAuthenticateUseCase } from '@/domain/usecases/authenticate/authenticate.usecase.interface';
import { Public } from '@/infra/auth/public';
import { Body, Controller, Get, Inject, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticateSessionInputDTO,
  AuthenticateSessionOutputDTO,
} from '../dtos/authenticate.dto';

@ApiTags('Authenticate')
@Controller('sessions')
export class AuthenticateController {
  constructor(
    @Inject(AuthenticateUseCase.name)
    private readonly authenticateUseCase: IAuthenticateUseCase,
  ) {}

  @Post()
  @Public()
  async session(
    @Body() { email, password }: AuthenticateSessionInputDTO,
  ): Promise<AuthenticateSessionOutputDTO> {
    const restul = await this.authenticateUseCase.execute({ email, password });
    return restul;
  }

  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
