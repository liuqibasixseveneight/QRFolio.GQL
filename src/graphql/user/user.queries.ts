import chalk from 'chalk';

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

  usersByIds: async (_: unknown, args: { userIds: string[] }) => {
    try {
      console.log(
        `${chalk.bgYellow('<< ? >>')} ${chalk.yellow(
          `Looking up users by IDs: ${args.userIds.length} IDs`
        )}`
      );

      // Validate input
      if (
        !args.userIds ||
        !Array.isArray(args.userIds) ||
        args.userIds.length === 0
      ) {
        console.log(
          `${chalk.bgRed('<< ✗ >>')} ${chalk.red('No user IDs provided')}`
        );
        return [];
      }

      // Remove duplicates and filter out empty strings
      const uniqueUserIds = [...new Set(args.userIds)].filter(
        (id) => id && typeof id === 'string' && id.trim() !== ''
      );

      if (uniqueUserIds.length === 0) {
        console.log(
          `${chalk.bgRed('<< ✗ >>')} ${chalk.red('No valid user IDs provided')}`
        );
        return [];
      }

      // Fetch users and profiles in parallel
      const [users, profiles] = await Promise.all([
        prisma.user.findMany({
          where: {
            id: {
              in: uniqueUserIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        }),
        prisma.profile.findMany({
          where: {
            id: {
              in: uniqueUserIds,
            },
          },
          select: {
            id: true,
            fullName: true,
          },
        }),
      ]);

      // Create a map of profile fullNames by ID
      const profileMap = new Map<string, string | null>();
      profiles.forEach((profile) => {
        profileMap.set(profile.id, profile.fullName ?? null);
      });

      // Create a map of user names by ID
      const userMap = new Map<string, string | null>();
      users.forEach((user) => {
        userMap.set(user.id, user.name ?? null);
      });

      // Build result array, preserving the order of input IDs
      const result = uniqueUserIds
        .map((userId) => {
          // Prefer fullName from profile, fallback to name from user
          const fullName =
            profileMap.get(userId) ?? userMap.get(userId) ?? null;

          // Only return if user exists
          if (userMap.has(userId) || profileMap.has(userId)) {
            return {
              id: userId,
              fullName,
            };
          }
          return null;
        })
        .filter(
          (item): item is { id: string; fullName: string | null } =>
            item !== null
        );

      console.log(
        `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
          `Found ${result.length} users out of ${uniqueUserIds.length} requested IDs`
        )}`
      );

      return result;
    } catch (error) {
      console.error(
        `${chalk.bgRed('<< ! >>')} ${chalk.red(
          'Error looking up users by IDs:'
        )}`,
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to look up users: ${errorMessage}`);
    }
  },
};
