import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { IDeleteProcessDisputeUseCase } from '@/domain/usecases/process-dispute/delete-process-dispute.usecase.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteProcessDisputeUseCase implements IDeleteProcessDisputeUseCase {
  constructor(private readonly processDisputeRepository: IProcessDisputeRepository) {}
  async execute(id: string): Promise<void> {
    const result = await this.processDisputeRepository.find(id);

    if (!result) {
      throw new NotFoundException('ProcessDispute not found!');
    }

    await this.processDisputeRepository.delete(id);
  }
}
