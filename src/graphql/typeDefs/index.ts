import { mergeTypeDefs } from '@graphql-tools/merge';

import { userTypeDefs } from './user.typeDefs';
import { userMutations } from '../mutations';

export const typeDefs = mergeTypeDefs([userTypeDefs, userMutations]);
