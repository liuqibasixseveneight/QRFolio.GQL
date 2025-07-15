import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
  }

  type Query {
    users: [User!]!
  }
`;
