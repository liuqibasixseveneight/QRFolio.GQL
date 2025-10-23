import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userMutations = {
  createUser: async (_: any, args: { email: string; name?: string }) => {
    try {
      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existingUser) {
        throw new Error(
          `A user with email ${args.email} already exists. Please use a different email address or try logging in instead.`
        );
      }

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
    } catch (error: any) {
      // Handle Prisma unique constraint errors as a fallback
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new Error(
          `A user with email ${args.email} already exists. Please use a different email address or try logging in instead.`
        );
      }
      // Re-throw other errors
      throw error;
    }
  },
};
