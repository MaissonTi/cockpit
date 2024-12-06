import { BatchModel } from '@/domain/models/batch.model';
import { Paginated, Pagination } from '../types/pagination.types';

export namespace IBatchRepository {
  export type paramsCreate = Omit<BatchModel, 'id' | 'createdAt' | 'updatedAt'>;
  export type paramsUpdate = Partial<Omit<BatchModel, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface IBatchRepository {
  find(id: string): Promise<BatchModel | null>;
  create(data: IBatchRepository.paramsCreate): Promise<BatchModel>;
  update(id: string, data: IBatchRepository.paramsUpdate): Promise<BatchModel>;
  delete(id: string): Promise<void>;
  list(where: Partial<BatchModel>, pagination?: Pagination): Promise<Paginated<BatchModel>>;
}
