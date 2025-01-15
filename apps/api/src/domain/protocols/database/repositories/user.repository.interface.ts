import { UserModel } from '@/domain/models/user.model';
import { Paginated, Pagination } from '../types/pagination.types';

export namespace IUserRepository {
  export type paramsCreate = Omit<UserModel, 'id'>;
  export type paramsUpdate = Partial<Omit<UserModel, 'id' | 'email'>>;
}

export interface IUserRepository {
  find(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  create(data: IUserRepository.paramsCreate): Promise<UserModel>;
  update(id: string, data: IUserRepository.paramsUpdate): Promise<UserModel>;
  delete(id: string): Promise<void>;
  list(
    filter?: Partial<UserModel>,
    pagination?: Pagination,
  ): Promise<Paginated<UserModel>>;
}
