import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { Paginated, Pagination } from '../types/pagination.types';

export namespace IProcessDisputeRepository {
  export type paramsCreate = Partial<
    Omit<ProcessDisputeModel, 'id' | 'createdAt' | 'updatedAt'>
  >;
  export type paramsUpdate = Partial<
    Omit<ProcessDisputeModel, 'id' | 'createdAt' | 'updatedAt'>
  >;
}

export interface IProcessDisputeRepository {
  find(id: string): Promise<ProcessDisputeModel | null>;
  create(
    data: IProcessDisputeRepository.paramsCreate,
  ): Promise<ProcessDisputeModel>;
  update(
    id: string,
    data: IProcessDisputeRepository.paramsUpdate,
  ): Promise<ProcessDisputeModel>;
  delete(id: string): Promise<void>;
  list(
    where: Partial<ProcessDisputeModel>,
    pagination?: Pagination,
  ): Promise<Paginated<ProcessDisputeModel>>;
}
