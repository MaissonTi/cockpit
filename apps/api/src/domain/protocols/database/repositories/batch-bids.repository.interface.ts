import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { Paginated, Pagination } from '../types/pagination.types';

export namespace IBatchBidsRepository {
  export type paramsCreate = Omit<
    BatchBidsModel,
    'id' | 'createdAt' | 'updatedAt'
  >;
  export type paramsUpdate = Partial<
    Omit<BatchBidsModel, 'id' | 'createdAt' | 'updatedAt'>
  >;
}

export interface IBatchBidsRepository {
  find(id: string): Promise<BatchBidsModel | null>;
  create(data: IBatchBidsRepository.paramsCreate): Promise<BatchBidsModel>;
  update(
    id: string,
    data: IBatchBidsRepository.paramsUpdate,
  ): Promise<BatchBidsModel>;
  delete(id: string): Promise<void>;
  list(
    where: Partial<BatchBidsModel>,
    pagination?: Pagination,
  ): Promise<Paginated<BatchBidsModel>>;
}
