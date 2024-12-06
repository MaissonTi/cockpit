import { BatchModel } from '@/domain/models/batch.model';
import { Paginated, Pagination } from '@/domain/protocols/database/types/pagination.types';

export namespace IListBatchUseCase {
  export type Input = Partial<BatchModel>;
  export type Output = Paginated<BatchModel>;
}

export interface IListBatchUseCase {
  execute(
    filter?: IListBatchUseCase.Input,
    pagination?: Pagination
  ): Promise<IListBatchUseCase.Output>;
}
