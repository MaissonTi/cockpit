import { BatchModel } from '@/domain/models/batch.model';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { IGetBatchUseCase } from '@/domain/usecases/batch/get-batch.usecase.interface';

export class GetBatchUseCase implements IGetBatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}
  async execute(id: string): Promise<BatchModel> {
    return await this.batchRepository.find(id);
  }
}

