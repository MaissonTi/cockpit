import { DeleteBatchBidsUseCase } from '@/app/usecases/batch-bids/delete-batch-bids.usecase';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { mockBatchBids } from '@test/_mock/model/batch-bids.mock';
import { mockBatchBidsRepository } from '@test/_mock/repository/batch-bids.repository.mock';

interface SutTypes {
  sut: DeleteBatchBidsUseCase;
  batchBidsRepository: IBatchBidsRepository;
}
const makeSut = (): SutTypes => {
  const batchBidsRepository: IBatchBidsRepository = mockBatchBidsRepository();

  const sut = new DeleteBatchBidsUseCase(batchBidsRepository);
  return { sut, batchBidsRepository };
};
describe('DeleteBatchBidsUseCase', () => {
  it('should remover a BatchBids', async () => {
    const { sut, batchBidsRepository } = makeSut();

    await sut.execute(mockBatchBids.id);

    expect(batchBidsRepository.find).toHaveBeenCalledWith(mockBatchBids.id);
    expect(batchBidsRepository.delete).toHaveBeenCalledWith(mockBatchBids.id);
  });

  it('should throw an exception of type NotFoundException', async () => {
    const { sut, batchBidsRepository } = makeSut();
    jest.spyOn(batchBidsRepository, 'find').mockReturnValueOnce(Promise.resolve(null));

    const promise = sut.execute(mockBatchBids.id);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(batchBidsRepository.delete).not.toHaveBeenCalled();
  });
});
