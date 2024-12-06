import { BatchModel } from '@/domain/models/batch.model';
import { IBatchRepository } from '@/domain/protocols/database/repositories/batch.repository.interface';
import {
  Paginated,
  Pagination,
} from '@/domain/protocols/database/types/pagination.types';
import { BatchMapper } from '../mapper/batch.mapper';
import { PrismaService } from '../prisma.service';
import { Repositories } from './_repositories.abstract';

export class BatchRepository extends Repositories implements IBatchRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async find(id: string): Promise<BatchModel | null> {
    const result = await this.prisma.batch.findFirst({
      where: { id },
    });
    return BatchMapper.toModel(result);
  }

  async update(id: string, data: BatchModel): Promise<BatchModel> {
    const result = await this.prisma.batch.update({
      where: { id: id },
      data: BatchMapper.toPrisma(data),
    });

    return BatchMapper.toModel(result);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.batch.delete({
      where: {
        id,
      },
    });
  }

  async create(data: IBatchRepository.paramsCreate): Promise<BatchModel> {
    const result = await this.prisma.batch.create({
      data: {
        name: data.name,
        processDisputeId: data.processDisputeId,
      },
    });
    return BatchMapper.toModel(result);
  }

  async list(
    { status, id, processDisputeId }: Partial<BatchModel>,
    pagination?: Pagination,
  ): Promise<Paginated<BatchModel>> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.batch.count({
        where: { status, id, processDisputeId },
      }),
      this.prisma.batch.findMany({
        where: { status, id, processDisputeId },
        ...this.pageSkipTake(pagination),
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      ...this.pageInfo(total, pagination),
      data: data.map(BatchMapper.toModel),
    };
  }
}
