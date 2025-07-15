import { gql } from 'apollo-server';

export const userMutations = gql`
  type Mutation {
    createUser(email: String!, name: String): User!
  }
`;
