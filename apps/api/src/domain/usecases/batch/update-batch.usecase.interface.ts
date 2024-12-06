import { BatchModel } from '@/domain/models/batch.model';

export namespace IUpdateBatchUseCase {
  export type Input = Partial<Omit<BatchModel, 'id' | 'createdAt' | 'updatedAt'>>;
  export type Output = BatchModel;
}

export interface IUpdateBatchUseCase {
  execute(id: string, data: IUpdateBatchUseCase.Input): Promise<BatchModel>;
}
