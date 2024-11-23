import { Module } from '@nestjs/common';
import { ProcessDisputeRepository } from './prisma/repositories/process-dispute.repository';

import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './prisma/repositories/user.repositories';

@Module({
  imports: [],
  providers: [
    PrismaService,
    UserRepository.toFactory(),
    ProcessDisputeRepository.toFactory(),
  ],
  exports: [UserRepository.name, ProcessDisputeRepository.name],
})
export class DatabaseModule {}
