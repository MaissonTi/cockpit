import { UserMessageModel } from '@repo/domain/models/user-message.model';

export namespace ICreateUserMessageUseCase {
  export type Input = Omit<UserMessageModel, 'id'>;
  export type Output = UserMessageModel;
}

export interface ICreateUserMessageUseCase {
  execute(data: ICreateUserMessageUseCase.Input): Promise<UserMessageModel>;
}
