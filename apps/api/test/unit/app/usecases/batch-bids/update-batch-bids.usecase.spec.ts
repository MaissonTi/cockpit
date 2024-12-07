import { UpdateBatchBidsUseCase } from '@/app/usecases/batch-bids/update-batch-bids.usecase';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';

import { NotFoundException } from '@nestjs/common';
import { mockBatchBids, mockBatchBidsUpdate } from '@test/_mock/model/batch-bids.mock';
import { mockBatchBidsRepository } from '@test/_mock/repository/batch-bids.repository.mock';

interface SutTypes {
  sut: UpdateBatchBidsUseCase;
  batchBidsRepository: IBatchBidsRepository;
}

const makeSut = (): SutTypes => {
  const batchBidsRepository: IBatchBidsRepository = mockBatchBidsRepository();

  const sut = new UpdateBatchBidsUseCase(batchBidsRepository);
  return { sut, batchBidsRepository };
};
describe('UpdateBatchBidsUseCase', () => {
  it('should update a BatchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();

    const result = await sut.execute(mockBatchBids.id, mockBatchBidsUpdate);

    expect(result.name).toEqual('New Name');
    expect(batchBidsRepository.find).toHaveBeenCalledWith(mockBatchBids.id);
    expect(batchBidsRepository.update).toHaveBeenCalled();
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, batchBidsRepository } = makeSut();
    jest.spyOn(batchBidsRepository, 'find').mockReturnValue(Promise.resolve(null));

    const promise = sut.execute(mockBatchBids.id, mockBatchBidsUpdate);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(batchBidsRepository.find).toHaveBeenCalledWith(mockBatchBids.id);
    expect(batchBidsRepository.update).not.toHaveBeenCalled();
  });
});
