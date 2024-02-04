import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// This module is global-scoped, meaning it's available in every other module.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
