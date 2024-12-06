import { GetBatchUseCase } from '@/app/usecases/batch/get-batch.usecase';
import { ListBatchUseCase } from '@/app/usecases/batch/list-batch.usecase';
import { UpdateBatchUseCase } from '@/app/usecases/batch/update-batch.usecase';
import { IGetBatchUseCase } from '@/domain/usecases/batch/get-batch.usecase.interface';
import { IListBatchUseCase } from '@/domain/usecases/batch/list-batch.usecase.interface';
import { IUpdateBatchUseCase } from '@/domain/usecases/batch/update-batch.usecase.interface';
import { Public } from '@/infra/auth/public';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiTags
} from '@nestjs/swagger';
import {
  BatchListQueryDTO,
  BatchListResponseDTO,
  BatchResponseDTO,
  BatchUpdateRequestDTO
} from '../dtos/batch.dto';
import { BatchPresenter } from '../presenters/batch.presenter';

@ApiTags('Batch')
@Controller('batch')
@Public()
export class BatchController {
  constructor(
    @Inject(ListBatchUseCase.name)
    private readonly listBatchUseCase: IListBatchUseCase,
    @Inject(UpdateBatchUseCase.name)
    private readonly updateBatchUseCase: IUpdateBatchUseCase,
    @Inject(GetBatchUseCase.name)
    private readonly getBatchUseCase: IGetBatchUseCase,
  ) {}

  @Get(':id')
  async find(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BatchResponseDTO | null> {
    const result = await this.getBatchUseCase.execute(id);
    return BatchPresenter.toHTTP<BatchResponseDTO>(result).get();
  }

  @Get()
  async list(
    @Query() { currentPage, perPage, ...filter }: BatchListQueryDTO,
  ): Promise<BatchListResponseDTO> {
    const result = await this.listBatchUseCase.execute(filter, {
      currentPage,
      perPage,
    });
    return {
      ...result,
      data: result.data.map(item =>
        BatchPresenter.toHTTP<BatchResponseDTO>(item).get(),
      ),
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: BatchUpdateRequestDTO,
  ): Promise<BatchResponseDTO> {
    const result = await this.updateBatchUseCase.execute(id, data);
    return BatchPresenter.toHTTP<BatchResponseDTO>(result).get();
  }
}
