import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';

export namespace ICreateProcessDisputeUseCase {
  export type Input = Partial<Omit<ProcessDisputeModel, 'id'>>;
  export type Output = ProcessDisputeModel;
}

export interface ICreateProcessDisputeUseCase {
  execute(
    data: ICreateProcessDisputeUseCase.Input,
  ): Promise<ProcessDisputeModel>;
}
