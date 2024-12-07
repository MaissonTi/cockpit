import { CreateBatchBidsUseCase } from '@/app/usecases/batch-bids/create-batch-bids.usecase';
import { DeleteBatchBidsUseCase } from '@/app/usecases/batch-bids/delete-batch-bids.usecase';
import { GetBatchBidsUseCase } from '@/app/usecases/batch-bids/get-batch-bids.usecase';
import { ListBatchBidsUseCase } from '@/app/usecases/batch-bids/list-batch-bids.usecase';
import { UpdateBatchBidsUseCase } from '@/app/usecases/batch-bids/update-batch-bids.usecase';
import { ICreateBatchBidsUseCase } from '@/domain/usecases/batch-bids/create-batch-bids.usecase.interface';
import { IDeleteBatchBidsUseCase } from '@/domain/usecases/batch-bids/delete-batch-bids.usecase.interface';
import { IGetBatchBidsUseCase } from '@/domain/usecases/batch-bids/get-batch-bids.usecase.interface';
import { IListBatchBidsUseCase } from '@/domain/usecases/batch-bids/list-batch-bids.usecase.interface';
import { IUpdateBatchBidsUseCase } from '@/domain/usecases/batch-bids/update-batch-bids.usecase.interface';
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
  BatchBidsCreateRequestDTO,
  BatchBidsListQueryDTO,
  BatchBidsListResponseDTO,
  BatchBidsResponseDTO,
  BatchBidsUpdateRequestDTO,
} from '../dtos/batch-bids.dto';
import { BatchBidsPresenter } from '../presenters/batch-bids.presenter';

@ApiTags('BatchBids')
@Controller('batch-bids')
@Public()
export class BatchBidsController {
  constructor(
    @Inject(CreateBatchBidsUseCase.name)
    private readonly createBatchBidsUseCase: ICreateBatchBidsUseCase,
    @Inject(ListBatchBidsUseCase.name)
    private readonly listBatchBidsUseCase: IListBatchBidsUseCase,
    @Inject(UpdateBatchBidsUseCase.name)
    private readonly updateBatchBidsUseCase: IUpdateBatchBidsUseCase,
    @Inject(DeleteBatchBidsUseCase.name)
    private readonly deleteBatchBidsUseCase: IDeleteBatchBidsUseCase,
    @Inject(GetBatchBidsUseCase.name)
    private readonly getBatchBidsUseCase: IGetBatchBidsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a BatchBids' })
  @ApiNoContentResponse({ description: 'BatchBids created' })
  @ApiBadRequestResponse({ description: 'BatchBids already exists!' })
  async create(
    @Body() data: BatchBidsCreateRequestDTO,
  ): Promise<BatchBidsResponseDTO> {
    const result = await this.createBatchBidsUseCase.execute(data);
    return BatchBidsPresenter.toHTTP<BatchBidsResponseDTO>(result).get();
  }

  @Get(':id')
  async find(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BatchBidsResponseDTO | null> {
    const result = await this.getBatchBidsUseCase.execute(id);
    return BatchBidsPresenter.toHTTP<BatchBidsResponseDTO>(result).get();
  }

  @Get()
  async list(
    @Query() { currentPage, perPage, ...filter }: BatchBidsListQueryDTO,
  ): Promise<BatchBidsListResponseDTO> {
    const result = await this.listBatchBidsUseCase.execute(filter, {
      currentPage,
      perPage,
    });
    return {
      ...result,
      data: result.data.map(item =>
        BatchBidsPresenter.toHTTP<BatchBidsResponseDTO>(item).get(),
      ),
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: BatchBidsUpdateRequestDTO,
  ): Promise<BatchBidsResponseDTO> {
    const result = await this.updateBatchBidsUseCase.execute(id, {
      isDecline: data.isDecline,
    });
    return BatchBidsPresenter.toHTTP<BatchBidsResponseDTO>(result).get();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteBatchBidsUseCase.execute(id);
  }
}
