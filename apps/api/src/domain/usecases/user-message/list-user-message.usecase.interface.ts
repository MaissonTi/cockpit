import { UserMessageModel } from '@repo/domain/models/user-message.model';
import {
  Paginated,
  Pagination,
} from '@/domain/protocols/database/types/pagination.types';

export namespace IListUserMessageUseCase {
  export type Input = Partial<UserMessageModel>;
  export type Output = Paginated<UserMessageModel>;
}

export interface IListUserMessageUseCase {
  execute(
    filter?: IListUserMessageUseCase.Input,
    pagination?: Pagination,
  ): Promise<IListUserMessageUseCase.Output>;
}
