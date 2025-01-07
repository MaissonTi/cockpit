import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { IDeclineBatchBidsUseCase } from '@/domain/usecases/batch-bids/decline-batch-bids.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeclineBatchBidsUseCase implements IDeclineBatchBidsUseCase {
  constructor(private readonly batchBidsRepository: IBatchBidsRepository) {}
  async execute({
    reason,
    ids,
  }: IDeclineBatchBidsUseCase.Input): Promise<void> {
    await Promise.all(
      ids.map(async id => {
        const batchBid = await this.batchBidsRepository.update(id, {
          reason,
          isDecline: true,
        });
        if (!batchBid) {
          throw new NotFoundException(`BatchBids not found`);
        }
      }),
    );
  }
}
