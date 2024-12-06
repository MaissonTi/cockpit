import { BatchModel } from '@/domain/models/batch.model';

export namespace IGetBatchUseCase {
  export type Output = BatchModel | null;
}

export interface IGetBatchUseCase {
  execute(id: string): Promise<IGetBatchUseCase.Output>;
}
