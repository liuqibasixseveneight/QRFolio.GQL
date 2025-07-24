import { gql } from 'apollo-server';

export const profileTypeDefs = gql`
  scalar JSON

  """
  Represents a user's profile containing resume and personal information
  """
  type Profile {
    """
    Unique identifier of the profile (same as user ID)
    """
    id: ID!

    """
    Full name of the user
    """
    fullName: String!

    """
    Optional phone number (numbers only expected)
    """
    phone: String

    """
    Email address
    """
    email: String!

    """
    Optional LinkedIn URL
    """
    linkedin: String

    """
    Optional portfolio URL
    """
    portfolio: String

    """
    Professional summary text
    """
    professionalSummary: String!

    """
    Array of work experience objects stored as JSON
    """
    workExperience: JSON!

    """
    Array of education objects stored as JSON
    """
    education: JSON!

    """
    Array of language proficiency objects stored as JSON
    """
    languages: JSON!

    """
    Timestamp when the profile was created
    """
    createdAt: String!
  }

  type Query {
    """
    Retrieve a profile by its ID
    """
    profile(id: ID!): Profile

    """
    Retrieve all profiles
    """
    profiles: [Profile!]!
  }

  type Mutation {
    """
    Create a profile
    """
    createProfile(
      id: ID!
      fullName: String!
      phone: String
      email: String!
      linkedin: String
      portfolio: String
      professionalSummary: String!
      workExperience: JSON!
      education: JSON!
      languages: JSON!
    ): Profile!

    """
    Update an existing profile
    """
    updateProfile(
      id: ID!
      fullName: String
      phone: String
      email: String
      linkedin: String
      portfolio: String
      professionalSummary: String
      workExperience: JSON
      education: JSON
      languages: JSON
    ): Profile!
  }
`;
