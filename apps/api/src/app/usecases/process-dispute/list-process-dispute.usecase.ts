import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { IListProcessDisputeUseCase } from '@/domain/usecases/process-dispute/list-process-dispute.usecase.interface';

export class ListProcessDisputeUseCase implements IListProcessDisputeUseCase {
  constructor(
    private readonly processDisputeRepository: IProcessDisputeRepository,
  ) {}
  async execute(
    filter?: IListProcessDisputeUseCase.Input,
    pagination?: Pagination,
  ): Promise<IListProcessDisputeUseCase.Output> {
    return this.processDisputeRepository.list(filter, pagination);
  }
}
