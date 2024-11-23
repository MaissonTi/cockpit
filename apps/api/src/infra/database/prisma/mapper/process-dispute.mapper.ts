import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { ProcessDispute as ProcessDisputePrisma } from '@prisma/client';

export class ProcessDisputeMapper {
  protected static objectModel(data: ProcessDisputePrisma): any {
    return {
      ...data,
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  protected static objectPrisma(data: ProcessDisputeModel): any {
    return {
      ...data,
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toModel(data: ProcessDisputePrisma): ProcessDisputeModel | null {
    return data && ProcessDisputeMapper.objectModel(data);
  }

  static toPrisma(data: ProcessDisputeModel): ProcessDisputePrisma | null {
    return data && ProcessDisputeMapper.objectPrisma(data);
  }
}
