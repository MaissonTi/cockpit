import { UserModel } from '@/domain/models/user.model';

export namespace IGetUserUseCase {
  export type Output = UserModel | null;
}

export interface IGetUserUseCase {
  execute(id: string): Promise<IGetUserUseCase.Output>;
}
