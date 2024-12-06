import { GetBatchUseCase } from '@/app/usecases/batch/get-batch.usecase';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { mockBatch } from '@test/_mock/model/batch.mock';
import { mockBatchRepository } from '@test/_mock/repository/batch.repository.mock';

interface SutTypes {
  sut: GetBatchUseCase;
  batchRepository: IBatchRepository;
}
const makeSut = (): SutTypes => {
  const batchRepository: IBatchRepository = mockBatchRepository();

  const sut = new GetBatchUseCase(batchRepository);
  return { sut, batchRepository };
};
describe('GetBatchUseCase', () => {
  it('should get a Batch', async () => {
    const { sut, batchRepository } = makeSut();

    const result = await sut.execute(mockBatch.id);

    expect(result.id).toEqual(mockBatch.id);
    expect(batchRepository.find).toHaveBeenCalledWith(mockBatch.id);
  });
});
