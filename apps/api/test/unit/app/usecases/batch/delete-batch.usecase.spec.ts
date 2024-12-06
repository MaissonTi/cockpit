import { DeleteBatchUseCase } from '@/app/usecases/batch/delete-batch.usecase';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { mockBatch } from '@test/_mock/model/batch.mock';
import { mockBatchRepository } from '@test/_mock/repository/batch.repository.mock';

interface SutTypes {
  sut: DeleteBatchUseCase;
  batchRepository: IBatchRepository;
}
const makeSut = (): SutTypes => {
  const batchRepository: IBatchRepository = mockBatchRepository();

  const sut = new DeleteBatchUseCase(batchRepository);
  return { sut, batchRepository };
};
describe('DeleteBatchUseCase', () => {
  it('should remover a Batch', async () => {
    const { sut, batchRepository } = makeSut();

    await sut.execute(mockBatch.id);

    expect(batchRepository.find).toHaveBeenCalledWith(mockBatch.id);
    expect(batchRepository.delete).toHaveBeenCalledWith(mockBatch.id);
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, batchRepository } = makeSut();
    jest.spyOn(batchRepository, 'find').mockReturnValueOnce(Promise.resolve(null));

    const promise = sut.execute(mockBatch.id);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(batchRepository.delete).not.toHaveBeenCalled();
  });
});
