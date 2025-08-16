import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const profileQueries = {
  profiles: async () => {
    const profiles = await prisma.profile.findMany({
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
        updatedAt: true,
      },
    });

    // Transform DateTime fields to ISO strings
    return profiles.map((profile) => ({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    }));
  },

  profile: async (_: any, args: { id: string }) => {
    const profile = await prisma.profile.findUnique({
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
        updatedAt: true,
      },
    });

    if (!profile) return null;

    // Transform DateTime fields to ISO strings
    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  },
};
