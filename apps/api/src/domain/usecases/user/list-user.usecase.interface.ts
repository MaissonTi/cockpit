import { UserModel } from '@/domain/models/user.model';
import {
  Paginated,
  Pagination,
} from '@/domain/protocols/database/types/pagination.types';

export namespace IListUserUseCase {
  export type Input = Partial<UserModel>;
  export type Output = Paginated<UserModel>;
}

export interface IListUserUseCase {
  execute(
    filter?: IListUserUseCase.Input,
    pagination?: Pagination,
  ): Promise<IListUserUseCase.Output>;
}
