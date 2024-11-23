import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { Paginated, Pagination } from '@/domain/protocols/database/types/pagination.types';

export namespace IListProcessDisputeUseCase {
  export type Input = Partial<ProcessDisputeModel>;
  export type Output = Paginated<ProcessDisputeModel>;
}

export interface IListProcessDisputeUseCase {
  execute(
    filter?: IListProcessDisputeUseCase.Input,
    pagination?: Pagination,
  ): Promise<IListProcessDisputeUseCase.Output>;
}
