import { api, Options } from '@/lib/http-service';
import { UserMessageResponseDTO as Message } from '@repo/domain/dtos/user-message.dto';

interface ListParams {
  currentPage: number;
  perPage: number;
  filters?: {
    userId?: string;
    destinateId?: string;
  };
}

interface ListReponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

class UserMessageService {
  static async list(
    { currentPage, perPage, filters }: ListParams,
    option?: Options,
  ): Promise<ListReponse<Message>> {
    return await api
      .get(`user-messages`, {
        ...option,
        searchParams: { currentPage, perPage, ...filters },
      })
      .json<ListReponse<Message>>();
  }
}

export default UserMessageService;
