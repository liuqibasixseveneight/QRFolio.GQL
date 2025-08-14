import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const profileQueries = {
  profiles: async () => {
    return await prisma.profile.findMany({
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        linkedin: true,
        portfolio: true,
        professionalSummary: true,
        availability: true,
        workExperience: true,
        education: true,
        languages: true,
        createdAt: true,
      },
    });
  },

  profile: async (_: any, args: { id: string }) => {
    return await prisma.profile.findUnique({
      where: { id: args.id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        linkedin: true,
        portfolio: true,
        professionalSummary: true,
        availability: true,
        workExperience: true,
        education: true,
        languages: true,
        createdAt: true,
      },
    });
  },
};
