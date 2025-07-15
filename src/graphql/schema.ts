import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { userMutations, userQueries, userTypeDefs } from './user';

const typeDefs = mergeTypeDefs([userTypeDefs]);

const resolvers = mergeResolvers([
  {
    Query: {
      ...userQueries,
    },
    Mutation: {
      ...userMutations,
    },
  },
]);

export const schema = { typeDefs, resolvers };
