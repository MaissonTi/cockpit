import { UserModel } from '@/domain/models/user.model';

export namespace IUpdateUserUseCase {
  export type Input = Partial<Omit<UserModel, 'id' | 'email' | 'createdAt' | 'updatedAt'>>;
  export type Output = UserModel;
}

export interface IUpdateUserUseCase {
  execute(id: string, data: IUpdateUserUseCase.Input): Promise<IUpdateUserUseCase.Output>;
}
