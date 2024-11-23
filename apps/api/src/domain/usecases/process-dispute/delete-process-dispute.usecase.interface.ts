export interface IDeleteProcessDisputeUseCase {
  execute(id: string): Promise<void>;
}
