import { IProcessDisputeRepository } from '@/domain/protocols/database/repositories/process-dispute.repository.interface';
import { Paginated, Pagination } from '@/domain/protocols/database/types/pagination.types';
import { PrismaService } from '../prisma.service';
import { ProcessDisputeModel } from '@/domain/models/process-dispute.model';
import { ProcessDisputeMapper } from '../mapper/process-dispute.mapper';
import { Repositories } from './_repositories.abstract';

export class ProcessDisputeRepository extends Repositories implements IProcessDisputeRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async find(id: string): Promise<ProcessDisputeModel | null> {
    const result = await this.prisma.processDispute.findFirst({
      where: { id },
    });
    return ProcessDisputeMapper.toModel(result);
  }

  async update(id: string, data: ProcessDisputeModel): Promise<ProcessDisputeModel> {
    const result = await this.prisma.processDispute.update({
      where: { id: id },
      data: ProcessDisputeMapper.toPrisma(data),
    });

    return ProcessDisputeMapper.toModel(result);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.processDispute.delete({
      where: {
        id,
      },
    });
  }

  async create(data: IProcessDisputeRepository.paramsCreate): Promise<ProcessDisputeModel> {
    const result = await this.prisma.processDispute.create({
      data: {
        name: data.name,
      },
    });
    return ProcessDisputeMapper.toModel(result);
  }

  async list(where: Partial<ProcessDisputeModel>, pagination?: Pagination): Promise<Paginated<ProcessDisputeModel>> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.processDispute.count({
        where,
      }),
      this.prisma.processDispute.findMany({
        where,
        ...this.pageSkipTake(pagination),
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { ...this.pageInfo(total, pagination), data: data.map(ProcessDisputeMapper.toModel) };
  }
}
