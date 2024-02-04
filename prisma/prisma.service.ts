import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // This class extends the PrismaClient class, which means it has all the methods that PrismaClient has.
  async onModuleInit() {
    await this.$connect();
  }

  // This method is used to enable shutdown hooks for the Prisma client.
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
