import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { IListBatchUseCase } from '@/domain/usecases/batch/list-batch.usecase.interface';

export class ListBatchUseCase implements IListBatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}
  async execute(
    filter?: IListBatchUseCase.Input,
    pagination?: Pagination
  ): Promise<IListBatchUseCase.Output> {
    return this.batchRepository.list(filter, pagination);
  }
}
