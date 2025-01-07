import { CreateBatchBidsUseCase } from '@/app/usecases/batch-bids/create-batch-bids.usecase';
import { InfraModule } from '@/infra/_infra.module';
import { BatchBidsRepository } from '@/infra/database/prisma/repositories/batch-bids.repository';
import { Module } from '@nestjs/common';
import { DeclineBatchBidsUseCase } from './decline-batch-bids.usecase';
import { DeleteBatchBidsUseCase } from './delete-batch-bids.usecase';
import { GetBatchBidsUseCase } from './get-batch-bids.usecase';
import { ListBatchBidsUseCase } from './list-batch-bids.usecase';
import { UpdateBatchBidsUseCase } from './update-batch-bids.usecase';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [BatchBidsRepository.name],
      provide: CreateBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new CreateBatchBidsUseCase(batchBidsRepository),
    },
    {
      inject: [BatchBidsRepository.name],
      provide: DeleteBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new DeleteBatchBidsUseCase(batchBidsRepository),
    },
    {
      inject: [BatchBidsRepository.name],
      provide: UpdateBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new UpdateBatchBidsUseCase(batchBidsRepository),
    },
    {
      inject: [BatchBidsRepository.name],
      provide: GetBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new GetBatchBidsUseCase(batchBidsRepository),
    },
    {
      inject: [BatchBidsRepository.name],
      provide: ListBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new ListBatchBidsUseCase(batchBidsRepository),
    },
    {
      inject: [BatchBidsRepository.name],
      provide: DeclineBatchBidsUseCase.name,
      useFactory: (batchBidsRepository: BatchBidsRepository) =>
        new DeclineBatchBidsUseCase(batchBidsRepository),
    },
  ],
  exports: [
    CreateBatchBidsUseCase.name,
    DeleteBatchBidsUseCase.name,
    UpdateBatchBidsUseCase.name,
    GetBatchBidsUseCase.name,
    ListBatchBidsUseCase.name,
    DeclineBatchBidsUseCase.name,
  ],
})
export class BatchBidsModule {}
