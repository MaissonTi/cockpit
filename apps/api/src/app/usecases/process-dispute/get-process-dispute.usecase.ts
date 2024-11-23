import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { IGetProcessDisputeUseCase } from '@/domain/usecases/process-dispute/get-process-dispute.usecase.interface';

export class GetProcessDisputeUseCase implements IGetProcessDisputeUseCase {
  constructor(private readonly processDisputeRepository: IProcessDisputeRepository) {}
  async execute(id: string): Promise<ProcessDisputeModel> {
    return await this.processDisputeRepository.find(id);
  }
}
