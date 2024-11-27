import { CreateUserMessageUseCase } from '@/app/usecases/user-message/create-user-message.usecase';
import { Body, Controller, Inject, Post, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IListUserMessageUseCase } from '@/domain/usecases/user-message/list-user-message.usecase.interface';
import { ICreateUserMessageUseCase } from '@/domain/usecases/user-message/create-user-message.usecase.interface';
import { ListUserMessageUseCase } from '@/app/usecases/user-message/list-user-message.usecase';
import { UserMessagePresenter } from '../presenters/user-message.presenter';
import {
  UserMessageResponseDTO,
  UserMessageCreateRequestDTO,
  UserMessageListQueryDTO,
  UserMessageListResponseDTO,
  UserMessageRequestDTO,
} from '@repo/domain/dtos/user-message.dto';
import {
  PaginationQueryDTO,
  PaginationResponseDTO,
} from '../dtos/_pagination.dto';

@ApiExtraModels(
  PaginationQueryDTO,
  PaginationResponseDTO,
  UserMessageCreateRequestDTO,
  UserMessageListQueryDTO,
  UserMessageListResponseDTO,
  UserMessageRequestDTO,
  UserMessageResponseDTO,
)
@ApiTags('UserMessage')
@Controller('user-messages')
export class UserMessageController {
  constructor(
    @Inject(ListUserMessageUseCase.name)
    private readonly listUserMessageUseCase: IListUserMessageUseCase,

    @Inject(CreateUserMessageUseCase.name)
    private readonly createUserMessageUseCase: ICreateUserMessageUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a User' })
  @ApiNoContentResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'User already exists!' })
  async create(
    @Body() body: UserMessageCreateRequestDTO,
  ): Promise<UserMessageResponseDTO> {
    const result = await this.createUserMessageUseCase.execute(body);
    return UserMessagePresenter.toHTTP<UserMessageResponseDTO>(result).get();
  }

  @Get()
  async list(
    @Query() { currentPage, perPage, ...filter }: UserMessageListQueryDTO,
  ): Promise<UserMessageListResponseDTO> {
    const result = await this.listUserMessageUseCase.execute(filter, {
      currentPage,
      perPage,
    });
    return {
      ...result,
      data: result.data.map((user) =>
        UserMessagePresenter.toHTTP<UserMessageResponseDTO>(user).get(),
      ),
    };
  }
}
