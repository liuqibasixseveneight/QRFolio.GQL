import { PrismaClient } from '@prisma/client';

import type {
  CreateProfileArgs,
  UpdateProfileArgs,
  SkillCategory,
} from './types';

const prisma = new PrismaClient();

/**
 * Validates that permittedUsers is an array of valid user IDs
 */
function validatePermittedUsers(permittedUsers: any): string[] {
  if (!permittedUsers) {
    return [];
  }

  if (!Array.isArray(permittedUsers)) {
    throw new Error('permittedUsers must be an array of user IDs');
  }

  // Validate each user ID is a non-empty string
  const validatedUsers = permittedUsers.filter((userId) => {
    if (typeof userId !== 'string' || userId.trim() === '') {
      console.warn(`Invalid user ID in permittedUsers: ${userId}`);
      return false;
    }
    return true;
  });

  return validatedUsers;
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

export const profileMutations = {
  createProfile: async (_: any, args: CreateProfileArgs) => {
    // Validate permittedUsers
    const validatedPermittedUsers = validatePermittedUsers(args.permittedUsers);

    const profile = await prisma.profile.create({
      data: {
        id: args.id,
        fullName: args.fullName,
        phone: args.phone,
        email: args.email,
        linkedin: args.linkedin,
        portfolio: args.portfolio,
        professionalSummary: args.professionalSummary,
        availability: args.availability,
        workExperience: args.workExperience,
        education: args.education,
        languages: args.languages,
        skills: args.skills,
        accessLevel: args.accessLevel,
        showName: args.showName ?? true,
        showEmail: args.showEmail ?? true,
        showPhone: args.showPhone ?? true,
        showLinkedIn: args.showLinkedIn ?? true,
        showPortfolio: args.showPortfolio ?? true,
        showWorkExperience: args.showWorkExperience ?? true,
        showEducation: args.showEducation ?? true,
        showLanguages: args.showLanguages ?? true,
        showSkills: args.showSkills ?? true,
        permittedUsers: validatedPermittedUsers,
      },
    });

    // Transform the returned profile to match GraphQL schema
    return {
      ...profile,
      skills: transformSkills(profile.skills),
      accessRequests: profile.accessRequests || [],
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  },

  updateProfile: async (_: any, args: UpdateProfileArgs) => {
    const { id, ...updateData } = args;

    // Validate permittedUsers if provided
    if (updateData.permittedUsers !== undefined) {
      updateData.permittedUsers = validatePermittedUsers(
        updateData.permittedUsers
      );
    }

    // Filter out undefined values but keep null values
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const profile = await prisma.profile.update({
      where: { id },
      data: filteredData,
    });

    // Transform the returned profile to match GraphQL schema
    return {
      ...profile,
      skills: transformSkills(profile.skills),
      accessRequests: profile.accessRequests || [],
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  },

  updateProfileSettings: async (_: any, args: any) => {
    const { id, visibility, ...updateData } = args;

    // Build the update object
    const updateObject: any = {};

    // Map visibility to accessLevel for database
    if (visibility !== undefined) {
      updateObject.accessLevel = visibility;
    }

    // Validate and set permittedUsers if provided
    if (updateData.permittedUsers !== undefined) {
      updateObject.permittedUsers = validatePermittedUsers(
        updateData.permittedUsers
      );
    }

    // Set accessRequests if provided
    if (updateData.accessRequests !== undefined) {
      updateObject.accessRequests = Array.isArray(updateData.accessRequests)
        ? updateData.accessRequests.filter(
            (id: any) => id && typeof id === 'string'
          )
        : [];
    }

    // Add all the show flags if provided
    if (updateData.showName !== undefined)
      updateObject.showName = updateData.showName;
    if (updateData.showEmail !== undefined)
      updateObject.showEmail = updateData.showEmail;
    if (updateData.showPhone !== undefined)
      updateObject.showPhone = updateData.showPhone;
    if (updateData.showLinkedIn !== undefined)
      updateObject.showLinkedIn = updateData.showLinkedIn;
    if (updateData.showPortfolio !== undefined)
      updateObject.showPortfolio = updateData.showPortfolio;
    if (updateData.showWorkExperience !== undefined)
      updateObject.showWorkExperience = updateData.showWorkExperience;
    if (updateData.showEducation !== undefined)
      updateObject.showEducation = updateData.showEducation;
    if (updateData.showLanguages !== undefined)
      updateObject.showLanguages = updateData.showLanguages;
    if (updateData.showSkills !== undefined)
      updateObject.showSkills = updateData.showSkills;

    // Update the profile
    const profile = await prisma.profile.update({
      where: { id },
      data: updateObject,
    });

    // Return the profile settings in the same format as getProfileSettings
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
  },
};
