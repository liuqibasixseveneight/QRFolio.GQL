import { prisma } from '../../lib/prisma';

export const userQueries = {
  users: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  },
};
