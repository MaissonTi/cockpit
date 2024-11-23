import { UserModel } from '@/domain/models/user.model';

type Presenter<T> = {
  get: () => T;
};

export class UserPresenter {
  static toHTTP<T, K extends UserModel = UserModel>(data: K): Presenter<T> {
    return {
      get: () => UserPresenter.get<T>(data),
    };
  }

  protected static get<T>(data: UserModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt,
      } as T)
    );
  }
}
