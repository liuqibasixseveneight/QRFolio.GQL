import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import type { SkillCategory } from './types';

const prisma = new PrismaClient();

/**
 * Creates a dynamic select object for Prisma queries based on show flags
 * Only includes fields in the database query when their show flag is true
 */
function createPrivacySelect(showFlags: any) {
  const baseSelect: any = {
    id: true,
    accessLevel: true,
    permittedUsers: true,
    createdAt: true,
    updatedAt: true,
  };

  // Only include fields in the select if their show flag is true
  if (showFlags.showName) {
    baseSelect.fullName = true;
  }

  if (showFlags.showEmail) {
    baseSelect.email = true;
  }

  if (showFlags.showPhone) {
    baseSelect.phone = true;
  }

  if (showFlags.showLinkedIn) {
    baseSelect.linkedin = true;
  }

  if (showFlags.showPortfolio) {
    baseSelect.portfolio = true;
  }

  // Always include professionalSummary and availability (no show flags for these)
  baseSelect.professionalSummary = true;
  baseSelect.availability = true;

  if (showFlags.showWorkExperience) {
    baseSelect.workExperience = true;
  }

  if (showFlags.showEducation) {
    baseSelect.education = true;
  }

  if (showFlags.showLanguages) {
    baseSelect.languages = true;
  }

  if (showFlags.showSkills) {
    baseSelect.skills = true;
  }

  return baseSelect;
}

/**
 * Transforms raw skills JSON from database to GraphQL SkillCategory structure
 * Handles null/undefined values and malformed data gracefully
 */
function transformSkills(rawSkills: any): SkillCategory[] {
  // Handle null/undefined
  if (!rawSkills) {
    return [];
  }

  // If it's already an array, validate and transform
  if (Array.isArray(rawSkills)) {
    return rawSkills
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        title: item.title || '',
        skills: Array.isArray(item.skills)
          ? item.skills
              .filter((skill: any) => skill && typeof skill === 'object')
              .map((skill: any) => ({ skill: skill.skill || null }))
          : [],
      }))
      .filter((category) => category.title); // Only include categories with titles
  }

  // If it's not an array, return empty array (fallback for malformed data)
  console.warn(
    'Skills data is not in expected array format, returning empty array'
  );
  return [];
}

export const profileQueries = {
  profiles: async () => {
    try {
      console.log(
        `${chalk.bgYellow('<< ? >>')} ${chalk.yellow('Fetching all profiles')}`
      );

      // First, get all profiles with only show flags to determine what to select
      const profilesWithFlags = await prisma.profile.findMany({
        select: {
          id: true,
          showName: true,
          showEmail: true,
          showPhone: true,
          showLinkedIn: true,
          showPortfolio: true,
          showWorkExperience: true,
          showEducation: true,
          showLanguages: true,
          showSkills: true,
          accessRequests: true,
        },
      });

      // Fetch full profiles with privacy-aware field selection
      const profiles = await Promise.all(
        profilesWithFlags.map(async (profileFlags) => {
          const privacySelect = createPrivacySelect(profileFlags);

          // Always include show flags in the select for this specific profile
          const fullSelect = {
            ...privacySelect,
            showName: true,
            showEmail: true,
            showPhone: true,
            showLinkedIn: true,
            showPortfolio: true,
            showWorkExperience: true,
            showEducation: true,
            showLanguages: true,
            showSkills: true,
            permittedUsers: true,
            accessRequests: true,
            createdAt: true,
            updatedAt: true,
          };

          return await prisma.profile.findUnique({
            where: { id: profileFlags.id },
            select: fullSelect,
          });
        })
      );

      console.log(
        `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
          `Found ${profiles.length} profiles`
        )}`
      );

      // Transform DateTime fields to ISO strings and skills structure
      return (profiles as any[])
        .filter((profile) => profile !== null)
        .map((profile) => ({
          ...profile,
          skills: profile.skills ? transformSkills(profile.skills) : [],
          accessRequests: profile.accessRequests || [],
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

      // First, get the profile's show flags to determine what to select
      const profileFlags = await prisma.profile.findUnique({
        where: { id: args.id },
        select: {
          id: true,
          showName: true,
          showEmail: true,
          showPhone: true,
          showLinkedIn: true,
          showPortfolio: true,
          showWorkExperience: true,
          showEducation: true,
          showLanguages: true,
          showSkills: true,
          accessRequests: true,
        },
      });

      if (!profileFlags) {
        console.log(
          `${chalk.bgRed('<< ✗ >>')} ${chalk.red('Profile not found')}`
        );
        return null;
      }

      // Create privacy-aware select based on show flags
      const privacySelect = createPrivacySelect(profileFlags);

      // Always include show flags and other required fields
      const fullSelect = {
        ...privacySelect,
        showName: true,
        showEmail: true,
        showPhone: true,
        showLinkedIn: true,
        showPortfolio: true,
        showWorkExperience: true,
        showEducation: true,
        showLanguages: true,
        showSkills: true,
        permittedUsers: true,
        accessRequests: true,
        createdAt: true,
        updatedAt: true,
      };

      const profile = await prisma.profile.findUnique({
        where: { id: args.id },
        select: fullSelect,
      });

      console.log(
        profile
          ? `${chalk.bgGreen('<< ✔ >>')} ${chalk.green('Profile found')}`
          : `${chalk.bgRed('<< ✗ >>')} ${chalk.red('Profile not found')}`
      );

      if (!profile) {
        return null;
      }

      // Transform DateTime fields to ISO strings and skills structure
      return {
        ...(profile as any),
        skills: (profile as any).skills
          ? transformSkills((profile as any).skills)
          : [],
        accessRequests: (profile as any).accessRequests || [],
        createdAt: (profile as any).createdAt.toISOString(),
        updatedAt: (profile as any).updatedAt.toISOString(),
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

  getProfileSettings: async (_: any, args: { id: string }) => {
    try {
      console.log(
        `${chalk.bgYellow('<< ? >>')} ${chalk.yellow(
          `Fetching profile settings for ID: ${args.id}`
        )}`
      );

      // Fetch only the settings-related fields
      const profile = await prisma.profile.findUnique({
        where: { id: args.id },
        select: {
          id: true,
          accessLevel: true,
          permittedUsers: true,
          accessRequests: true,
          showName: true,
          showEmail: true,
          showPhone: true,
          showLinkedIn: true,
          showPortfolio: true,
          showWorkExperience: true,
          showEducation: true,
          showLanguages: true,
          showSkills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!profile) {
        console.log(
          `${chalk.bgRed('<< ✗ >>')} ${chalk.red('Profile not found')}`
        );
        return null;
      }

      console.log(
        `${chalk.bgGreen('<< ✔ >>')} ${chalk.green('Profile settings found')}`
      );

      // Return the profile settings with visibility mapped from accessLevel
      return {
        id: profile.id,
        visibility: profile.accessLevel,
        permittedUsers: profile.permittedUsers || [],
        accessRequests: profile.accessRequests || [],
        showName: profile.showName,
        showEmail: profile.showEmail,
        showPhone: profile.showPhone,
        showLinkedIn: profile.showLinkedIn,
        showPortfolio: profile.showPortfolio,
        showWorkExperience: profile.showWorkExperience,
        showEducation: profile.showEducation,
        showLanguages: profile.showLanguages,
        showSkills: profile.showSkills,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error(
        `${chalk.bgRed('<< ! >>')} ${chalk.red(
          'Error fetching profile settings:'
        )}`,
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch profile settings: ${errorMessage}`);
    }
  },
};
