import { api, Options } from '@/lib/http-service';

type CreateUser = {
  name: string;
  email: string;
  password: string;
};

type UpdateUser = CreateUser & {
  id: string;
};

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ListParams {
  currentPage: number;
  perPage: number;
  filters?: {
    name?: string;
    email?: string;
  };
}

interface ListReponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

class UserService {
  static async create(
    { name, email, password }: CreateUser,
    option?: Options,
  ): Promise<void> {
    await api.post(`users`, { ...option, json: { name, email, password } });
  }

  static async update(
    { id, name }: UpdateUser,
    option?: Options,
  ): Promise<void> {
    await api.put(`users/${id}`, { ...option, json: { name } });
  }

  static async list(
    { currentPage, perPage, filters }: ListParams,
    option?: Options,
  ): Promise<ListReponse<User>> {
    return await api
      .get(`users`, {
        ...option,
        searchParams: { currentPage, perPage, ...filters },
      })
      .json<ListReponse<User>>();
  }

  static async delete(id: string, option?: Options): Promise<void> {
    await api.delete(`users/${id}`, option).json<void>();
  }

  static async find(id: string, option?: Options): Promise<User> {
    return await api.get(`users/${id}`, option).json<User>();
  }
}

export default UserService;
