import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { profileMutations, profileQueries, profileTypeDefs } from './profile';
import { userMutations, userQueries, userTypeDefs } from './user';

const typeDefs = mergeTypeDefs([profileTypeDefs, userTypeDefs]);

const resolvers = mergeResolvers([
  {
    Query: {
      ...profileQueries,
      ...userQueries,
    },
    Mutation: {
      ...profileMutations,
      ...userMutations,
    },
  },
]);

export const schema = { typeDefs, resolvers };
