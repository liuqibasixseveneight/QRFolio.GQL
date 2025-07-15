import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_: any, args: { email: string; name?: string }) => {
      return await prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
        },
      });
    },
  },
};
