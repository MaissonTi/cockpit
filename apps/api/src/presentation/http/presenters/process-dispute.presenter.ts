import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';

type Presenter<T> = {
  get: () => T;
};

export class ProcessDisputePresenter {
  static toHTTP<T, K extends ProcessDisputeModel = ProcessDisputeModel>(data: K): Presenter<T> {
    return {
      get: () => ProcessDisputePresenter.get<T>(data),
    };
  }

  protected static get<T>(data: ProcessDisputeModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        name: data.name,
      } as T)
    );
  }
}
