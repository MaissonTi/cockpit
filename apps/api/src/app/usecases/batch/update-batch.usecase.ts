import { BatchModel } from '@/domain/models/batch.model';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { IUpdateBatchUseCase } from '@/domain/usecases/batch/update-batch.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateBatchUseCase implements IUpdateBatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}
  async execute(id: string, data: IUpdateBatchUseCase.Input): Promise<BatchModel> {
    const result = await this.batchRepository.find(id);

    if (!result) {
      throw new NotFoundException(`Batch not found`);
    }

    return this.batchRepository.update(id, data);
  }
}
