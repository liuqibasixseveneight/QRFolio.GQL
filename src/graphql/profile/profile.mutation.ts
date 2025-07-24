import { PrismaClient } from '@prisma/client';

import type { CreateProfileArgs, UpdateProfileArgs } from './types';

const prisma = new PrismaClient();

export const profileMutations = {
  createProfile: async (_: any, args: CreateProfileArgs) => {
    return await prisma.profile.create({
      data: {
        id: args.id,
        fullName: args.fullName,
        phone: args.phone,
        email: args.email,
        linkedin: args.linkedin,
        portfolio: args.portfolio,
        professionalSummary: args.professionalSummary,
        workExperience: args.workExperience,
        education: args.education,
        languages: args.languages,
      },
    });
  },

  updateProfile: async (_: any, args: UpdateProfileArgs) => {
    const { id, ...updateData } = args;
    return await prisma.profile.update({
      where: { id },
      data: updateData,
    });
  },
};
