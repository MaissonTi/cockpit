import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';

export namespace IGetProcessDisputeUseCase {
  export type Output = ProcessDisputeModel | null;
}

export interface IGetProcessDisputeUseCase {
  execute(id: string): Promise<IGetProcessDisputeUseCase.Output>;
}
