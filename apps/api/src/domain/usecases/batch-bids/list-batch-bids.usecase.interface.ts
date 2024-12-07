import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { Paginated, Pagination } from '@/domain/protocols/database/types/pagination.types';

export namespace IListBatchBidsUseCase {
  export type Input = Partial<BatchBidsModel>;
  export type Output = Paginated<BatchBidsModel>;
}

export interface IListBatchBidsUseCase {
  execute(
    filter?: IListBatchBidsUseCase.Input,
    pagination?: Pagination
  ): Promise<IListBatchBidsUseCase.Output>;
}
