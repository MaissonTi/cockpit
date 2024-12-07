import { BatchBidsModel } from '@/domain/models/batch-bids.model';

export namespace IGetBatchBidsUseCase {
  export type Output = BatchBidsModel | null;
}

export interface IGetBatchBidsUseCase {
  execute(id: string): Promise<IGetBatchBidsUseCase.Output>;
}
