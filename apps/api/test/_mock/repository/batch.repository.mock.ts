import { BatchModel } from '@/domain/models/batch.model';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import { Paginated } from '@/domain/protocols/database/types/pagination.types';
import { mockBatch, mockBatchUpdate } from '../model/batch.mock';

export const mockBatchRepository = (): IBatchRepository => ({
  create: jest.fn().mockReturnValue(mockBatch),
  find: jest.fn().mockReturnValue(mockBatch),
  delete: jest.fn(),
  update: jest.fn().mockReturnValue(mockBatchUpdate),
  list: jest.fn().mockReturnValue({
    data: [mockBatch],
    total: 1,
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
  } as Paginated<BatchModel>),
});
