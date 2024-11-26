import { Module } from '@nestjs/common';
import { ProcessDisputeRepository } from './prisma/repositories/process-dispute.repository';

import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './prisma/repositories/user.repositories';
import { UserMessageRepository } from './prisma/repositories/user-message.repositories';

@Module({
  imports: [],
  providers: [
    PrismaService,
    UserRepository.toFactory(),
    ProcessDisputeRepository.toFactory(),
    UserMessageRepository.toFactory(),
  ],
  exports: [
    UserRepository.name,
    ProcessDisputeRepository.name,
    UserMessageRepository.name,
  ],
})
export class DatabaseModule {}
