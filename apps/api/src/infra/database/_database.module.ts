import { Module } from '@nestjs/common';
import { BatchBidsRepository } from './prisma/repositories/batch-bids.repository';
import { BatchRepository } from './prisma/repositories/batch.repository';
import { ProcessDisputeRepository } from './prisma/repositories/process-dispute.repository';

import { PrismaService } from './prisma/prisma.service';
import { UserMessageRepository } from './prisma/repositories/user-message.repositories';
import { UserRepository } from './prisma/repositories/user.repositories';

@Module({
  imports: [],
  providers: [
    PrismaService,
    UserRepository.toFactory(),
    ProcessDisputeRepository.toFactory(),
    UserMessageRepository.toFactory(),
    BatchRepository.toFactory(),
    BatchBidsRepository.toFactory(),
  ],
  exports: [
    UserRepository.name,
    ProcessDisputeRepository.name,
    UserMessageRepository.name,
    BatchRepository.name,
    BatchBidsRepository.name,
  ],
})
export class DatabaseModule {}
