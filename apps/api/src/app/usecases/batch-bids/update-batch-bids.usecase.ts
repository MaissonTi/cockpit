import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { IUpdateBatchBidsUseCase } from '@/domain/usecases/batch-bids/update-batch-bids.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateBatchBidsUseCase implements IUpdateBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute(
    id: string,
    data: IUpdateBatchBidsUseCase.Input,
  ): Promise<BatchBidsModel> {
    const result = await this.batchBidsRepository.find(id);

    if (!result) {
      throw new NotFoundException(`BatchBids not found`);
    }

    return this.batchBidsRepository.update(id, data);
  }
}
