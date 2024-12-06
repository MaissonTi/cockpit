import { BatchModel } from '@/domain/models/batch.model';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { ICreateBatchUseCase } from '@/domain/usecases/batch/create-batch.usecase.interface';

export class CreateBatchUseCase implements ICreateBatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}
  async execute(data: ICreateBatchUseCase.Input): Promise<BatchModel> {
    return this.batchRepository.create(data);
  }
}
