import { UserMessageModel } from '@repo/domain/models/user-message.model';
import { Paginated, Pagination } from '../types/pagination.types';

export namespace IUserMessageRepository {
  export type paramsCreate = Omit<UserMessageModel, 'id'>;
  export type paramsUpdate = Partial<Omit<UserMessageModel, 'id'>>;
}

export interface IUserMessageRepository {
  create(data: IUserMessageRepository.paramsCreate): Promise<UserMessageModel>;
  list(
    filter?: Partial<UserMessageModel>,
    pagination?: Pagination,
  ): Promise<Paginated<UserMessageModel>>;
}
