import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './prisma/repositories/user.repositories';

@Module({
  imports: [],
  providers: [PrismaService, UserRepository.toFactory()],
  exports: [UserRepository.name],
})
export class DatabaseModule {}
