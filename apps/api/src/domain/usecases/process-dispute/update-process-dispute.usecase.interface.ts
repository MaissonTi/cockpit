import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';

export namespace IUpdateProcessDisputeUseCase {
  export type Input = Partial<Omit<ProcessDisputeModel, 'id' | 'createdAt' | 'updatedAt'>>;
  export type Output = ProcessDisputeModel;
}

export interface IUpdateProcessDisputeUseCase {
  execute(id: string, data: IUpdateProcessDisputeUseCase.Input): Promise<ProcessDisputeModel>;
}
