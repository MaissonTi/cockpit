import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { IGetBatchBidsUseCase } from '@/domain/usecases/batch-bids/get-batch-bids.usecase.interface';

export class GetBatchBidsUseCase implements IGetBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute(id: string): Promise<BatchBidsModel> {
    return await this.batchBidsRepository.find(id);
  }
}

