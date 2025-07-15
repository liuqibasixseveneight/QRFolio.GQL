import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(email: String!, name: String): User!
  }
`;
