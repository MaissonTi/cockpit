export interface IDeleteBatchBidsUseCase {
  execute(id: string): Promise<void>;
}
