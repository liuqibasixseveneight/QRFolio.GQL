import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

const prisma = new PrismaClient();

export const profileQueries = {
  profiles: async () => {
    try {
      console.log(
        `${chalk.bgYellow('<< ? >>')} ${chalk.yellow('Fetching all profiles')}`
      );

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

      console.log(
        `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
          `Found ${profiles.length} profiles`
        )}`
      );

      // Transform DateTime fields to ISO strings and skills structure
      return profiles.map((profile) => ({
        ...profile,
        skills: profile.skills || [],
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error(
        `${chalk.bgRed('<< ! >>')} ${chalk.red('Error fetching profiles:')}`,
        error
      );

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch profiles: ${errorMessage}`);
    }
  },

  profile: async (_: any, args: { id: string }) => {
    try {
      console.log(
        `${chalk.bgYellow('<< ? >>')} ${chalk.yellow(
          `Fetching profile with ID: ${args.id}`
        )}`
      );

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

      console.log(
        profile
          ? `${chalk.bgGreen('<< ✔ >>')} ${chalk.green('Profile found')}`
          : `${chalk.bgRed('<< ✗ >>')} ${chalk.red('Profile not found')}`
      );

      if (!profile) return null;

      // Transform DateTime fields to ISO strings and skills structure
      return {
        ...profile,
        skills: profile.skills || [],
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error(
        `${chalk.bgRed('<< ! >>')} ${chalk.red('Error fetching profile:')}`,
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch profile: ${errorMessage}`);
    }
  },
};
