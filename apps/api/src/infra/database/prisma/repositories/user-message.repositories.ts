import {
  Paginated,
  Pagination,
} from '@/domain/protocols/database/types/pagination.types';
import { PrismaService } from '../prisma.service';
import { Repositories } from './_repositories.abstract';
import { IUserMessageRepository } from '@/domain/protocols/database/repositories/user-message.repository.interface';
import { UserMessageModel } from '@/domain/models/user-message.model';
import { UserMessageMapper } from '../mapper/user-message.mapper';
import { UsersMessagens as UsersMessagensPrisma } from '@prisma/client';

export class UserMessageRepository extends Repositories {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(
    data: IUserMessageRepository.paramsCreate,
  ): Promise<UserMessageModel> {
    try {
      const payload = {
        isGroup: data.isGroup,
        content: data.content,
        userId: data.userId,
        destinateId: data.destinateId,
      } as UsersMessagensPrisma;
      const result = await this.prisma.usersMessagens.create({
        data: payload,
      });
      return UserMessageMapper.toModel(result);
    } catch (error) {
      console.error(error);
    }
  }

  async list(
    filter?: Partial<UserMessageModel>,
    pagination?: Pagination,
  ): Promise<Paginated<UserMessageModel>> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.usersMessagens.count({
        where: {
          ...filter,
        },
      }),
      this.prisma.usersMessagens.findMany({
        where: {
          ...filter,
        },
        ...this.pageSkipTake(pagination),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      ...this.pageInfo(total, pagination),
      data: data.map(UserMessageMapper.toModel),
    };
  }
}
