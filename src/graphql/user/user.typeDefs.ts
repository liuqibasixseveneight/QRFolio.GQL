import gql from 'graphql-tag';

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

  """
  Represents a user lookup result with ID and full name
  """
  type UserLookup {
    """
    Unique identifier (UUID) of the user
    """
    id: ID!

    """
    Full name from the user's profile, or name from user if no profile exists
    """
    fullName: String
  }

  type Query {
    """
    Retrieves a list of all users
    """
    users: [User!]!

    """
    Looks up users by their IDs and returns their ID and full name.
    Useful for displaying permitted users or access requests.
    """
    usersByIds(userIds: [ID!]!): [UserLookup!]!
  }

  type Mutation {
    """
    Creates a new user with an email address and name (email is required)
    """
    createUser(email: String!, name: String): User!
  }
`;
