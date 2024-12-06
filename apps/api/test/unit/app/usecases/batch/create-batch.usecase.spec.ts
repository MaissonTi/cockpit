import { CreateBatchUseCase } from '@/app/usecases/batch/create-batch.usecase';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { mockBatch } from '@test/_mock/model/batch.mock';
import { mockBatchRepository } from '@test/_mock/repository/batch.repository.mock';

interface SutTypes {
  sut: CreateBatchUseCase;
  batchRepository: IBatchRepository;
}

const makeSut = (): SutTypes => {
  const batchRepository: IBatchRepository = mockBatchRepository();

  const sut = new CreateBatchUseCase(batchRepository);
  return { sut, batchRepository };
};
describe('CreateBatchUseCases', () => {
  it('should create new Batch', async () => {
    const { sut, batchRepository } = makeSut();

    const result = await sut.execute(mockBatch);

    expect(result.id).toEqual(mockBatch.id);
    expect(batchRepository.create).toHaveBeenCalledWith({ name: 'any_name' });
  });
});
