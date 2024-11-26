import { api, Options } from '@/lib/http-service';

interface UserMessage {
  id: string;
  userId: string;
  destinateId: string;
  isGroup?: boolean;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  ): Promise<ListReponse<UserMessage>> {
    return await api
      .get(`user-messages`, {
        ...option,
        searchParams: { currentPage, perPage, ...filters },
      })
      .json<ListReponse<UserMessage>>();
  }
}

export default UserMessageService;
