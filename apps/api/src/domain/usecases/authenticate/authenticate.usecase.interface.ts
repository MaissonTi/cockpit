export namespace IAuthenticateUseCase {
  export type Input = { email: string; password: string };
  export type Output = {
    user: { id: string; name: string; email: string; role: string };
    access_token: string;
  };
}

export interface IAuthenticateUseCase {
  execute(
    data: IAuthenticateUseCase.Input,
  ): Promise<IAuthenticateUseCase.Output>;
}
