import { Pagination } from '@/domain/protocols/database/types/pagination.types';
import { PrismaService } from '../prisma.service';

export abstract class Repositories {
  protected readonly prisma: PrismaService;
  constructor(readonly prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  protected runQuery<T>(query: Promise<T>): Promise<T> {
    return (this.prisma as any).$queryRaw(query);
  }

  protected pageSkipTake({ currentPage, perPage }: Pagination): {
    take: number;
    skip: number;
  } {
    return {
      skip: (currentPage - 1) * perPage,
      take: perPage,
    };
  }

  protected pageInfo(
    total: number,
    { currentPage, perPage }: Pagination,
  ): {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  } {
    const lastPage = Math.ceil(total / perPage);

    return {
      total,
      currentPage,
      lastPage,
      perPage,
    };
  }

  static toFactory<T extends Repositories>(
    this: new (prismaService: PrismaService) => T,
  ) {
    return {
      inject: [PrismaService],
      provide: this.name,
      useFactory: (prismaService: PrismaService) => new this(prismaService),
    };
  }
}
