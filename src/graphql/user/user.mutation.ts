import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userMutations = {
  createUser: async (_: any, args: { email: string; name?: string }) => {
    return await prisma.user.create({
      data: {
        email: args?.email,
        name: args?.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  },
};
