import { BatchBidsModel } from '@/domain/models/batch-bids.model';

export namespace IUpdateBatchBidsUseCase {
  export type Input = Partial<
    Omit<BatchBidsModel, 'id' | 'createdAt' | 'updatedAt'>
  >;
  export type Output = BatchBidsModel;
}

export interface IUpdateBatchBidsUseCase {
  execute(
    id: string,
    data: IUpdateBatchBidsUseCase.Input,
  ): Promise<BatchBidsModel>;
}
