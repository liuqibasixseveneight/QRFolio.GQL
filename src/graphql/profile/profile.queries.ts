import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const profileQueries = {
  profiles: async () => {
    try {
      console.log('Fetching all profiles...');

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
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`Found ${profiles.length} profiles`);

      // Transform DateTime fields to ISO strings
      return profiles.map((profile) => ({
        ...profile,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch profiles: ${errorMessage}`);
    }
  },

  profile: async (_: any, args: { id: string }) => {
    try {
      console.log(`Fetching profile with ID: ${args.id}`);

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
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`Profile found:`, profile ? 'Yes' : 'No');

      if (!profile) return null;

      // Transform DateTime fields to ISO strings
      return {
        ...profile,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch profile: ${errorMessage}`);
    }
  },
};
