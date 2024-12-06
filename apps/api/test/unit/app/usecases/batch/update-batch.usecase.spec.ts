import { UpdateBatchUseCase } from '@/app/usecases/batch/update-batch.usecase';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';

import { NotFoundException } from '@nestjs/common';
import { mockBatch, mockBatchUpdate } from '@test/_mock/model/batch.mock';
import { mockBatchRepository } from '@test/_mock/repository/batch.repository.mock';

interface SutTypes {
  sut: UpdateBatchUseCase;
  batchRepository: IBatchRepository;
}

const makeSut = (): SutTypes => {
  const batchRepository: IBatchRepository = mockBatchRepository();

  const sut = new UpdateBatchUseCase(batchRepository);
  return { sut, batchRepository };
};
describe('UpdateBatchUseCase', () => {
  it('should update a Batch', async () => {
    const { sut, batchRepository } = makeSut();

    const result = await sut.execute(mockBatch.id, mockBatchUpdate);

    expect(result.name).toEqual('New Name');
    expect(batchRepository.find).toHaveBeenCalledWith(mockBatch.id);
    expect(batchRepository.update).toHaveBeenCalled();
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, batchRepository } = makeSut();
    jest.spyOn(batchRepository, 'find').mockReturnValue(Promise.resolve(null));

    const promise = sut.execute(mockBatch.id, mockBatchUpdate);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(batchRepository.find).toHaveBeenCalledWith(mockBatch.id);
    expect(batchRepository.update).not.toHaveBeenCalled();
  });
});
