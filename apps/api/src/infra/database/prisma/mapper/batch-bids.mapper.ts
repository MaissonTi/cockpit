import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { BatchBids as BatchBidsPrisma } from '@prisma/client';

export class BatchBidsMapper {
  protected static objectModel(data: BatchBidsPrisma) {
    return {
      id: data.id,
      userId: data.userId,
      value: data.value,
      isDecline: data.isDecline,
      reason: data.reason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      batchId: data.batchId,
    };
  }

  protected static objectPrisma(data: BatchBidsModel) {
    return {
      id: data.id,
      batchId: data.batchId,
      userId: data.userId,
      value: data.value,
      isDecline: data.isDecline,
      reason: data.reason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toModel(data: BatchBidsPrisma): BatchBidsModel | null {
    return data && BatchBidsMapper.objectModel(data);
  }

  static toPrisma(data: BatchBidsModel): BatchBidsPrisma | null {
    return data && BatchBidsMapper.objectPrisma(data);
  }
}
