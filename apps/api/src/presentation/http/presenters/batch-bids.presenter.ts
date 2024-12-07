import { BatchBidsModel } from '@/domain/models/batch-bids.model';

type Presenter<T> = {
  get: () => T;
};

export class BatchBidsPresenter {
  static toHTTP<T, K extends BatchBidsModel = BatchBidsModel>(
    data: K,
  ): Presenter<T> {
    return {
      get: () => BatchBidsPresenter.get<T>(data),
    };
  }

  protected static get<T>(data: BatchBidsModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        batchId: data.batchId,
        userId: data.userId,
        value: data.value,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as T)
    );
  }
}
