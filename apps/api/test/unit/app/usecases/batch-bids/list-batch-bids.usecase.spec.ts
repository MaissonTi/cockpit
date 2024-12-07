import { ListBatchBidsUseCase } from '@/app/usecases/batch-bids/list-batch-bids.usecase';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { mockBatchBidsRepository } from '@test/_mock/repository/batch-bids.repository.mock';

interface SutTypes {
  sut: ListBatchBidsUseCase;
  batchBidsRepository: IBatchBidsRepository;
}
const makeSut = (): SutTypes => {
  const batchBidsRepository: IBatchBidsRepository = mockBatchBidsRepository();

  const sut = new ListBatchBidsUseCase(batchBidsRepository);
  return { sut, batchBidsRepository };
};
describe('ListBatchBidsUseCase', () => {
  it('should list multiple BatchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();

    const result = await sut.execute();

    expect(result.total).toEqual(1);
    expect(batchBidsRepository.list).toHaveBeenCalled();
  });

  it('should not return any batchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();
    jest.spyOn(batchBidsRepository, 'list').mockReturnValueOnce(
      Promise.resolve({
        total: 0,
        currentPage: 1,
        lastPage: 0,
        perPage: 20,
        data: [],
      }),
    );

    const result = await sut.execute();

    expect(result.total).toEqual(0);
    expect(batchBidsRepository.list).toHaveBeenCalled();
  });
});
