import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  """
  Represents a user of the QRFolio platform
  """
  type User {
    """
    Unique identifier (UUID) of the user
    """
    id: ID!

    """
    Unique email address of the user
    """
    email: String!

    """
    Optional display name of the user
    """
    name: String

    """
    Timestamp for when the user account was created
    """
    createdAt: String!
  }

  type Query {
    """
    Retrieves a list of all users
    """
    users: [User!]!
  }

  type Mutation {
    """
    Creates a new user with an email address and name (email is required)
    """
    createUser(email: String!, name: String): User!
  }
`;
