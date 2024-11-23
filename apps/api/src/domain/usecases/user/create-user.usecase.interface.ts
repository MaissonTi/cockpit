import { UserModel } from '@/domain/models/user.model';

export namespace ICreateUserUseCase {
  export type Input = Omit<UserModel, 'id' | 'role'>;
  export type Output = UserModel;
}

export interface ICreateUserUseCase {
  execute(data: ICreateUserUseCase.Input): Promise<UserModel>;
}
