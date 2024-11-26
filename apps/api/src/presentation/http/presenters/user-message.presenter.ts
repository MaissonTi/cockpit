import { UserMessageModel } from '@/domain/models/user-message.model';

type Presenter<T> = {
  get: () => T;
};

export class UserMessagePresenter {
  static toHTTP<T, K extends UserMessageModel = UserMessageModel>(
    data: K,
  ): Presenter<T> {
    return {
      get: () => UserMessagePresenter.get<T>(data),
    };
  }

  protected static get<T>(data: UserMessageModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        userId: data.userId,
        destinateId: data.destinateId,
        isGroup: data.isGroup,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as T)
    );
  }
}
