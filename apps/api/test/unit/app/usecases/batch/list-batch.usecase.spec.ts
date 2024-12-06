import { ListBatchUseCase } from '@/app/usecases/batch/list-batch.usecase';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { mockBatchRepository } from '@test/_mock/repository/batch.repository.mock';

interface SutTypes {
  sut: ListBatchUseCase;
  batchRepository: IBatchRepository;
}
const makeSut = (): SutTypes => {
  const batchRepository: IBatchRepository = mockBatchRepository();

  const sut = new ListBatchUseCase(batchRepository);
  return { sut, batchRepository };
};
describe('ListBatchUseCase', () => {
  it('should list multiple Batch', async () => {
    const { sut, batchRepository } = makeSut();

    const result = await sut.execute();

    expect(result.total).toEqual(1);
    expect(batchRepository.list).toHaveBeenCalled();
  });

  it('should not return any batch', async () => {
    const { sut, batchRepository } = makeSut();
    jest.spyOn(batchRepository, 'list').mockReturnValueOnce(
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
    expect(batchRepository.list).toHaveBeenCalled();
  });
});
