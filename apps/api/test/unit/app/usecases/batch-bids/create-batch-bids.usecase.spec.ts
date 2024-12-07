import { CreateBatchBidsUseCase } from '@/app/usecases/batch-bids/create-batch-bids.usecase';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { mockBatchBids } from '@test/_mock/model/batch-bids.mock';
import { mockBatchBidsRepository } from '@test/_mock/repository/batch-bids.repository.mock';

interface SutTypes {
  sut: CreateBatchBidsUseCase;
  batchBidsRepository: IBatchBidsRepository;
}

const makeSut = (): SutTypes => {
  const batchBidsRepository: IBatchBidsRepository = mockBatchBidsRepository();

  const sut = new CreateBatchBidsUseCase(batchBidsRepository);
  return { sut, batchBidsRepository };
};
describe('CreateBatchBidsUseCases', () => {
  it('should create new BatchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();

    const result = await sut.execute(mockBatchBids);

    expect(result.id).toEqual(mockBatchBids.id);
    expect(batchBidsRepository.create).toHaveBeenCalledWith({ name: 'any_name' });
  });
});
