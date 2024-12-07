import { BatchBidsModel } from '@/domain/models/batch-bids.model';

export const mockBatchBids = {
  id: 'any_id',
  name: 'any_name',
} as BatchBidsModel;

export const mockBatchBidsUpdate = {
  ...mockBatchBids,
  name: 'New Name',
} as BatchBidsModel;
