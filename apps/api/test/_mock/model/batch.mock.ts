import { BatchModel } from '@/domain/models/batch.model';

export const mockBatch = {
  id: 'any_id',
  name: 'any_name',
} as BatchModel;

export const mockBatchUpdate = {
  ...mockBatch,
  name: 'New Name',
} as BatchModel;
