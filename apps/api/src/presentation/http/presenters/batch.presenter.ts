import { BatchModel } from '@/domain/models/batch.model';

type Presenter<T> = {
  get: () => T;
};

export class BatchPresenter {
  static toHTTP<T, K extends BatchModel = BatchModel>(data: K): Presenter<T> {
    return {
      get: () => BatchPresenter.get<T>(data),
    };
  }

  protected static get<T>(data: BatchModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        name: data.name,
      } as T)
    );
  }
}
