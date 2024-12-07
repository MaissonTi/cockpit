import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { ICreateBatchBidsUseCase } from '@/domain/usecases/batch-bids/create-batch-bids.usecase.interface';

export class CreateBatchBidsUseCase implements ICreateBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute(data: ICreateBatchBidsUseCase.Input): Promise<BatchBidsModel> {
    return this.batchBidsRepository.create(data);
  }
}
