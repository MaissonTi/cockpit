import { BatchBidsModel } from '@/domain/models/batch-bids.model';

export namespace ICreateBatchBidsUseCase {
  export type Input = Omit<BatchBidsModel, 'id'>;
  export type Output = BatchBidsModel;
}

export interface ICreateBatchBidsUseCase {
  execute(data: ICreateBatchBidsUseCase.Input): Promise<BatchBidsModel>;
}
