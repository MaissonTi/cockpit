import { BatchBidsModel } from '@/domain/models/batch-bids.model';
import { IBatchBidsRepository } from '@/domain/protocols/database/repositories/batch-bids.repository.interface';
import {
    Paginated,
    Pagination,
} from '@/domain/protocols/database/types/pagination.types';
import { BatchBidsMapper } from '../mapper/batch-bids.mapper';
import { PrismaService } from '../prisma.service';
import { Repositories } from './_repositories.abstract';

export class BatchBidsRepository
  extends Repositories
  implements IBatchBidsRepository
{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async find(id: string): Promise<BatchBidsModel | null> {
    const result = await this.prisma.batchBids.findFirst({
      where: { id },
    });
    return BatchBidsMapper.toModel(result);
  }

  async update(
    id: string,
    data: IBatchBidsRepository.paramsUpdate,
  ): Promise<BatchBidsModel> {
    const result = await this.prisma.batchBids.update({
      where: { id: id },
      data: {
        value: data.value,
        isDecline: data.isDecline,
      },
    });

    return BatchBidsMapper.toModel(result);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.batchBids.delete({
      where: {
        id,
      },
    });
  }

  async create(
    data: IBatchBidsRepository.paramsCreate,
  ): Promise<BatchBidsModel> {
    const result = await this.prisma.batchBids.create({
      data: {
        userId: data.userId,
        value: data.value,
        batchId: data.batchId,
      },
    });
    return BatchBidsMapper.toModel(result);
  }

  async list(
    where: Partial<BatchBidsModel>,
    pagination?: Pagination,
  ): Promise<Paginated<BatchBidsModel>> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.batchBids.count({
        where,
      }),
      this.prisma.batchBids.findMany({
        where,
        ...this.pageSkipTake(pagination),
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      ...this.pageInfo(total, pagination),
      data: data.map(BatchBidsMapper.toModel),
    };
  }
}
