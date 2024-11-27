import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserMessageModel } from '@repo/domain/models/user-message.model';

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

  // Refactor this, remove generic T and use directly DTO
  protected static get<T>(data: UserMessageModel): T | null {
    return (
      data &&
      ({
        id: data.id,
        userId: data.userId,
        destinateId: data.destinateId,
        isGroup: data.isGroup,
        content: data.content,
        timestamp: format(data.createdAt, 'HH:mm', { locale: ptBR }),
        username: data.user?.name,
        createdAt: data.createdAt,
      } as T)
    );
  }
}
