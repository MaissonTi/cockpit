import { BatchModel } from '@/domain/models/batch.model';

export namespace ICreateBatchUseCase {
  export type Input = Omit<BatchModel, 'id'>;
  export type Output = BatchModel;
}

export interface ICreateBatchUseCase {
  execute(data: ICreateBatchUseCase.Input): Promise<BatchModel>;
}
