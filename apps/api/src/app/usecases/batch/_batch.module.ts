import { Module } from '@nestjs/common';
import { BatchRepository } from '@/infra/database/prisma/repositories/batch.repository';
import { CreateBatchUseCase } from '@/app/usecases/batch/create-batch.usecase';
import { InfraModule } from '@/infra/_infra.module';
import { DeleteBatchUseCase } from './delete-batch.usecase';
import { UpdateBatchUseCase } from './update-batch.usecase';
import { GetBatchUseCase } from './get-batch.usecase';
import { ListBatchUseCase } from './list-batch.usecase';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [BatchRepository.name],
      provide: CreateBatchUseCase.name,
      useFactory: (batchRepository: BatchRepository) => new CreateBatchUseCase(batchRepository),
    },
    {
      inject: [BatchRepository.name],
      provide: DeleteBatchUseCase.name,
      useFactory: (batchRepository: BatchRepository) => new DeleteBatchUseCase(batchRepository),
    },
    {
      inject: [BatchRepository.name],
      provide: UpdateBatchUseCase.name,
      useFactory: (batchRepository: BatchRepository) => new UpdateBatchUseCase(batchRepository),
    },
    {
      inject: [BatchRepository.name],
      provide: GetBatchUseCase.name,
      useFactory: (batchRepository: BatchRepository) => new GetBatchUseCase(batchRepository),
    },
    {
      inject: [BatchRepository.name],
      provide: ListBatchUseCase.name,
      useFactory: (batchRepository: BatchRepository) => new ListBatchUseCase(batchRepository),
    },
  ],
  exports: [
    CreateBatchUseCase.name,
    DeleteBatchUseCase.name,
    UpdateBatchUseCase.name,
    GetBatchUseCase.name,
    ListBatchUseCase.name,
  ],
})
export class BatchModule {}
