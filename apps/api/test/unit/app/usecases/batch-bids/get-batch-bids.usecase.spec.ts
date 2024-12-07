import { GetBatchBidsUseCase } from '@/app/usecases/batch-bids/get-batch-bids.usecase';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { mockBatchBids } from '@test/_mock/model/batch-bids.mock';
import { mockBatchBidsRepository } from '@test/_mock/repository/batch-bids.repository.mock';

interface SutTypes {
  sut: GetBatchBidsUseCase;
  batchBidsRepository: IBatchBidsRepository;
}
const makeSut = (): SutTypes => {
  const batchBidsRepository: IBatchBidsRepository = mockBatchBidsRepository();

  const sut = new GetBatchBidsUseCase(batchBidsRepository);
  return { sut, batchBidsRepository };
};
describe('GetBatchBidsUseCase', () => {
  it('should get a BatchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();

    const result = await sut.execute(mockBatchBids.id);

    expect(result.id).toEqual(mockBatchBids.id);
    expect(batchBidsRepository.find).toHaveBeenCalledWith(mockBatchBids.id);
  });
});
