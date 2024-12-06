import { BatchModel } from '@/domain/models/batch.model';
import { Batch as BatchPrisma } from '@prisma/client';

export class BatchMapper {
  protected static objectModel(data: BatchPrisma) {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
      durationTime: data.durationTime,
      processDisputeId: data.processDisputeId,
    };
  }

  protected static objectPrisma(data: BatchModel) {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
      durationTime: data.durationTime,
      winnerUserId: data.winnerUserId,
      winnerValue: data.winnerValue,
      processDisputeId: data.processDisputeId,
    };
  }

  static toModel(data: BatchPrisma): BatchModel | null {
    return data && BatchMapper.objectModel(data);
  }

  static toPrisma(data: BatchModel): BatchPrisma | null {
    return data && BatchMapper.objectPrisma(data);
  }
}
