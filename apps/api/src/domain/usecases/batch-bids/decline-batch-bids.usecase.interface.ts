import { BatchBidsModel } from '@/domain/models/batch-bids.model';

export namespace IDeclineBatchBidsUseCase {
  export type Input = {
    ids?: string[];
    reason: string;
  };
  export type Output = BatchBidsModel;
}

export interface IDeclineBatchBidsUseCase {
  execute(data: IDeclineBatchBidsUseCase.Input): Promise<void>;
}
