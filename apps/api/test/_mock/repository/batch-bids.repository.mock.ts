import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import { Paginated } from '@/domain/protocols/database/types/pagination.types';
import { mockBatchBids, mockBatchBidsUpdate } from '../model/batch-bids.mock';

export const mockBatchBidsRepository = (): IBatchBidsRepository => ({
  create: jest.fn().mockReturnValue(mockBatchBids),
  find: jest.fn().mockReturnValue(mockBatchBids),
  delete: jest.fn(),
  update: jest.fn().mockReturnValue(mockBatchBidsUpdate),
  list: jest.fn().mockReturnValue({
    data: [mockBatchBids],
    total: 1,
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
  } as Paginated<BatchBidsModel>),
});
