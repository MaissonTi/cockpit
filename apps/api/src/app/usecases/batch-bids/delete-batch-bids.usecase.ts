import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { IDeleteBatchBidsUseCase } from '@/domain/usecases/batch-bids/delete-batch-bids.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteBatchBidsUseCase implements IDeleteBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute(id: string): Promise<void> {
    const result = await this.batchBidsRepository.find(id);

    if (!result) {
      throw new NotFoundException('BatchBids not found!');
    }

    await this.batchBidsRepository.delete(id);
  }
}
