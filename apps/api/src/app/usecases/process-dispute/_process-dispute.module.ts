import { Module } from '@nestjs/common';
import { ProcessDisputeRepository } from '@/infra/database/prisma/repositories/process-dispute.repository';
import { CreateProcessDisputeUseCase } from '@/app/usecases/process-dispute/create-process-dispute.usecase';
import { InfraModule } from '@/infra/_infra.module';
import { DeleteProcessDisputeUseCase } from './delete-process-dispute.usecase';
import { UpdateProcessDisputeUseCase } from './update-process-dispute.usecase';
import { GetProcessDisputeUseCase } from './get-process-dispute.usecase';
import { ListProcessDisputeUseCase } from './list-process-dispute.usecase';

@Module({
  imports: [InfraModule],
  providers: [
    {
      inject: [ProcessDisputeRepository.name],
      provide: CreateProcessDisputeUseCase.name,
      useFactory: (processDisputeRepository: ProcessDisputeRepository) =>
        new CreateProcessDisputeUseCase(processDisputeRepository),
    },
    {
      inject: [ProcessDisputeRepository.name],
      provide: DeleteProcessDisputeUseCase.name,
      useFactory: (processDisputeRepository: ProcessDisputeRepository) =>
        new DeleteProcessDisputeUseCase(processDisputeRepository),
    },
    {
      inject: [ProcessDisputeRepository.name],
      provide: UpdateProcessDisputeUseCase.name,
      useFactory: (processDisputeRepository: ProcessDisputeRepository) =>
        new UpdateProcessDisputeUseCase(processDisputeRepository),
    },
    {
      inject: [ProcessDisputeRepository.name],
      provide: GetProcessDisputeUseCase.name,
      useFactory: (processDisputeRepository: ProcessDisputeRepository) =>
        new GetProcessDisputeUseCase(processDisputeRepository),
    },
    {
      inject: [ProcessDisputeRepository.name],
      provide: ListProcessDisputeUseCase.name,
      useFactory: (processDisputeRepository: ProcessDisputeRepository) =>
        new ListProcessDisputeUseCase(processDisputeRepository),
    },
  ],
  exports: [
    CreateProcessDisputeUseCase.name,
    DeleteProcessDisputeUseCase.name,
    UpdateProcessDisputeUseCase.name,
    GetProcessDisputeUseCase.name,
    ListProcessDisputeUseCase.name,
  ],
})
export class ProcessDisputeModule {}
