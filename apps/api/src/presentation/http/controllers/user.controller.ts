import { CreateUserUseCase } from '@/app/usecases/user/create-user.usecase';
import { DeleteUserUseCase } from '@/app/usecases/user/delete-user.usecase';
import { GetUserUseCase } from '@/app/usecases/user/get-user.usecase';
import { ListUserUseCase } from '@/app/usecases/user/list-user.usecase';
import { UpdateUserUseCase } from '@/app/usecases/user/update-user.usecase';
import { ICreateUserUseCase } from '@/domain/usecases/user/create-user.usecase.interface';
import { IDeleteUserUseCase } from '@/domain/usecases/user/delete-user.usecase.interface';
import { IGetUserUseCase } from '@/domain/usecases/user/get-user.usecase.interface';
import { IListUserUseCase } from '@/domain/usecases/user/list-user.usecase.interface';
import { IUpdateUserUseCase } from '@/domain/usecases/user/update-user.usecase.interface';
import { Public } from '@/infra/auth/public';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserCreateRequestDTO,
  UserListQueryDTO,
  UserListResponseDTO,
  UserResponseDTO,
  UserUpdateRequestDTO,
} from '../dtos/user.dto';
import { UserPresenter } from '../presenters/user.presenter';

@ApiTags('User')
@Controller('users')
@Public()
export class UserController {
  constructor(
    @Inject(CreateUserUseCase.name)
    private readonly createUserUseCase: ICreateUserUseCase,
    @Inject(ListUserUseCase.name)
    private readonly listUserUseCase: IListUserUseCase,
    @Inject(UpdateUserUseCase.name)
    private readonly updateUserUseCase: IUpdateUserUseCase,
    @Inject(DeleteUserUseCase.name)
    private readonly deleteUserUseCase: IDeleteUserUseCase,
    @Inject(GetUserUseCase.name)
    private readonly getUserUseCase: IGetUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a User' })
  @ApiNoContentResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'User already exists!' })
  async create(
    @Body() { name, email, password }: UserCreateRequestDTO,
  ): Promise<UserResponseDTO> {
    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });
    return UserPresenter.toHTTP<UserResponseDTO>(result).get();
  }

  @Get(':id')
  async find(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDTO | null> {
    const result = await this.getUserUseCase.execute(id);
    return UserPresenter.toHTTP<UserResponseDTO>(result).get();
  }

  @Get()
  async list(
    @Query() { currentPage, perPage, ...filter }: UserListQueryDTO,
  ): Promise<UserListResponseDTO> {
    const result = await this.listUserUseCase.execute(filter, {
      currentPage,
      perPage,
    });
    return {
      ...result,
      data: result.data.map((user) =>
        UserPresenter.toHTTP<UserResponseDTO>(user).get(),
      ),
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UserUpdateRequestDTO,
  ): Promise<UserResponseDTO> {
    const result = await this.updateUserUseCase.execute(id, data);
    return UserPresenter.toHTTP<UserResponseDTO>(result).get();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
