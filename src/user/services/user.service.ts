import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(user: CreateUserDto) {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({});
  }

  async findOne(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        profile: {
          include: {
            _count: {
              select: {
                following: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: string, user: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
