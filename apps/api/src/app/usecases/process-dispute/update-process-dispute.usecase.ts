import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { IUpdateProcessDisputeUseCase } from '@/domain/usecases/process-dispute/update-process-dispute.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateProcessDisputeUseCase implements IUpdateProcessDisputeUseCase {
  constructor(private readonly processDisputeRepository: IProcessDisputeRepository) {}
  async execute(id: string, data: IUpdateProcessDisputeUseCase.Input): Promise<ProcessDisputeModel> {
    const result = await this.processDisputeRepository.find(id);

    if (!result) {
      throw new NotFoundException(`ProcessDispute not found`);
    }

    return this.processDisputeRepository.update(id, data);
  }
}
