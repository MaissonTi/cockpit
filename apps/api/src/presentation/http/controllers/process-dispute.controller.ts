import { CreateProcessDisputeUseCase } from '@/app/usecases/process-dispute/create-process-dispute.usecase';
import { DeleteProcessDisputeUseCase } from '@/app/usecases/process-dispute/delete-process-dispute.usecase';
import { GetProcessDisputeUseCase } from '@/app/usecases/process-dispute/get-process-dispute.usecase';
import { ListProcessDisputeUseCase } from '@/app/usecases/process-dispute/list-process-dispute.usecase';
import { UpdateProcessDisputeUseCase } from '@/app/usecases/process-dispute/update-process-dispute.usecase';
import { ICreateProcessDisputeUseCase } from '@/domain/usecases/process-dispute/create-process-dispute.usecase.interface';
import { IDeleteProcessDisputeUseCase } from '@/domain/usecases/process-dispute/delete-process-dispute.usecase.interface';
import { IGetProcessDisputeUseCase } from '@/domain/usecases/process-dispute/get-process-dispute.usecase.interface';
import { IListProcessDisputeUseCase } from '@/domain/usecases/process-dispute/list-process-dispute.usecase.interface';
import { IUpdateProcessDisputeUseCase } from '@/domain/usecases/process-dispute/update-process-dispute.usecase.interface';
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
  ProcessDisputeCreateRequestDTO,
  ProcessDisputeListQueryDTO,
  ProcessDisputeListResponseDTO,
  ProcessDisputeResponseDTO,
  ProcessDisputeUpdateRequestDTO,
} from '../dtos/process-dispute.dto';
import { ProcessDisputePresenter } from '../presenters/process-dispute.presenter';

@ApiTags('ProcessDispute')
@Controller('process-dispute')
@Public()
export class ProcessDisputeController {
  constructor(
    @Inject(CreateProcessDisputeUseCase.name)
    private readonly createProcessDisputeUseCase: ICreateProcessDisputeUseCase,
    @Inject(ListProcessDisputeUseCase.name)
    private readonly listProcessDisputeUseCase: IListProcessDisputeUseCase,
    @Inject(UpdateProcessDisputeUseCase.name)
    private readonly updateProcessDisputeUseCase: IUpdateProcessDisputeUseCase,
    @Inject(DeleteProcessDisputeUseCase.name)
    private readonly deleteProcessDisputeUseCase: IDeleteProcessDisputeUseCase,
    @Inject(GetProcessDisputeUseCase.name)
    private readonly getProcessDisputeUseCase: IGetProcessDisputeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a ProcessDispute' })
  @ApiNoContentResponse({ description: 'ProcessDispute created' })
  @ApiBadRequestResponse({ description: 'ProcessDispute already exists!' })
  async create(
    @Body() { name }: ProcessDisputeCreateRequestDTO,
  ): Promise<ProcessDisputeResponseDTO> {
    const result = await this.createProcessDisputeUseCase.execute({ name });
    return ProcessDisputePresenter.toHTTP<ProcessDisputeResponseDTO>(
      result,
    ).get();
  }

  @Get(':id')
  async find(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProcessDisputeResponseDTO | null> {
    const result = await this.getProcessDisputeUseCase.execute(id);
    return ProcessDisputePresenter.toHTTP<ProcessDisputeResponseDTO>(
      result,
    ).get();
  }

  @Get()
  async list(
    @Query() { currentPage, perPage, ...filter }: ProcessDisputeListQueryDTO,
  ): Promise<ProcessDisputeListResponseDTO> {
    const result = await this.listProcessDisputeUseCase.execute(filter, {
      currentPage,
      perPage,
    });
    return {
      ...result,
      data: result.data.map((item) =>
        ProcessDisputePresenter.toHTTP<ProcessDisputeResponseDTO>(item).get(),
      ),
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: ProcessDisputeUpdateRequestDTO,
  ): Promise<ProcessDisputeResponseDTO> {
    const result = await this.updateProcessDisputeUseCase.execute(id, data);
    return ProcessDisputePresenter.toHTTP<ProcessDisputeResponseDTO>(
      result,
    ).get();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteProcessDisputeUseCase.execute(id);
  }
}
