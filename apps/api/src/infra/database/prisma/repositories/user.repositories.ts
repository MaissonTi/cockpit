import { UserModel } from '@/domain/models/user.model';
import { IUserRepository } from '@/domain/protocols/database/repositories/user.repository.interface';
import {
  Paginated,
  Pagination,
} from '@/domain/protocols/database/types/pagination.types';
import { UserMapper } from '../mapper/users.mapper';
import { PrismaService } from '../prisma.service';
import { Repositories } from './_repositories.abstract';

export class UserRepository extends Repositories {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async find(id: string): Promise<UserModel | null> {
    const result = await this.prisma.user.findFirst({
      where: { id },
    });
    return UserMapper.toModel(result);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return UserMapper.toModel(result);
  }

  async update(id: string, data: UserModel): Promise<UserModel> {
    const result = await this.prisma.user.update({
      where: { id: id },
      data: UserMapper.toPrisma(data),
    });

    return UserMapper.toModel(result);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async create(data: IUserRepository.paramsCreate): Promise<UserModel> {
    const result = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role,
      },
    });
    return UserMapper.toModel(result);
  }

  async list(
    filter?: Partial<UserModel>,
    pagination?: Pagination,
  ): Promise<Paginated<UserModel>> {
    const { email, name, ...values } = filter;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          ...values,
          email: {
            contains: email,
          },
          name: {
            contains: name,
          },
        },
      }),
      this.prisma.user.findMany({
        where: {
          ...values,
          email: {
            contains: email,
          },
          name: {
            contains: name,
          },
        },
        ...this.pageSkipTake(pagination),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      ...this.pageInfo(total, pagination),
      data: data.map(UserMapper.toModel),
    };
  }
}
