import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { compareHash, hash } from '@/utils/utils.constants';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async userLowInfo(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async usersLowInfo(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return users.map((item) => {
      delete item.password;
      return item;
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await hash(data.password),
      },
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    const user = await this.prisma.user.update({
      data: {
        ...data,
        password: params?.data?.password ? await hash(String(params?.data?.password)) : undefined,
      },
      where,
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.delete({
      where,
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async validatePassword(password: string, hashPassword: string): Promise<boolean> {
    return await compareHash(password, hashPassword);
  }
}
