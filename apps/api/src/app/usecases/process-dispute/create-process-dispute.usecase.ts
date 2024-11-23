// import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
// import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
// import { ICreateProcessDisputeUseCase } from '@/domain/usecases/process-dispute/create-process-dispute.usecase.interface';

import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { ICreateProcessDisputeUseCase } from '@/domain/usecases/process-dispute/create-process-dispute.usecase.interface';

export class CreateProcessDisputeUseCase
  implements ICreateProcessDisputeUseCase
{
  constructor(
    private readonly processDisputeRepository: IProcessDisputeRepository,
  ) {}
  async execute(
    data: ICreateProcessDisputeUseCase.Input,
  ): Promise<ProcessDisputeModel> {
    return this.processDisputeRepository.create({
      name: data.name,
    });
  }
}
