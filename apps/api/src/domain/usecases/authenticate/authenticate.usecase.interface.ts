export namespace IAuthenticateUseCase {
  export type Input = { email: string; password: string };
  export type Output = { user: { name: string; email: string }; access_token: string };
}

export interface IAuthenticateUseCase {
  execute(data: IAuthenticateUseCase.Input): Promise<IAuthenticateUseCase.Output>;
}
