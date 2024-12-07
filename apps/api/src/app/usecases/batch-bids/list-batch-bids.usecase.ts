import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { IListBatchBidsUseCase } from '@/domain/usecases/batch-bids/list-batch-bids.usecase.interface';

export class ListBatchBidsUseCase implements IListBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute(
    filter?: IListBatchBidsUseCase.Input,
    pagination?: Pagination
  ): Promise<IListBatchBidsUseCase.Output> {
    return this.batchBidsRepository.list(filter, pagination);
  }
}
