import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { IDeleteBatchUseCase } from '@/domain/usecases/batch/delete-batch.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteBatchUseCase implements IDeleteBatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}
  async execute(id: string): Promise<void> {
    const result = await this.batchRepository.find(id);

    if (!result) {
      throw new NotFoundException('Batch not found!');
    }

    await this.batchRepository.delete(id);
  }
}
