import { gql } from 'apollo-server';

export const profileTypeDefs = gql`
  scalar JSON

  """
  Represents a structured phone number with country information
  """
  type PhoneNumber {
    """
    Country code (e.g., "US", "CA")
    """
    countryCode: String!

    """
    International dialing code (e.g., "+1", "+44")
    """
    dialCode: String!

    """
    The actual phone number
    """
    number: String!

    """
    Country flag emoji or code
    """
    flag: String!
  }

  """
  Represents the availability status of a professional
  """
  enum Availability {
    available
    open
    unavailable
  }

  """
  Represents the access level of a profile
  """
  enum AccessLevel {
    public
    private
    restricted
  }

  """
  Represents a skill item
  """
  type Skill {
    """
    The skill name
    """
    skill: String
  }

  """
  Represents a category of skills
  """
  type SkillCategory {
    """
    The title/category name for the skills
    """
    title: String!

    """
    Array of skills in this category
    """
    skills: [Skill!]!
  }

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
    fullName: String

    """
    Phone number - can be either a string (legacy) or structured object
    """
    phone: JSON

    """
    Email address
    """
    email: String

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
    professionalSummary: String

    """
    Current availability status
    """
    availability: Availability

    """
    Array of work experience objects stored as JSON
    """
    workExperience: JSON

    """
    Array of education objects stored as JSON
    """
    education: JSON

    """
    Array of language proficiency objects stored as JSON
    """
    languages: JSON

    """
    Array of skill categories with nested skills
    """
    skills: [SkillCategory!]

    """
    Access level of the profile (public, private, restricted)
    """
    accessLevel: AccessLevel!

    """
    Privacy settings for profile fields
    """
    showName: Boolean!
    showEmail: Boolean!
    showPhone: Boolean!
    showLinkedIn: Boolean!
    showPortfolio: Boolean!
    showWorkExperience: Boolean!
    showEducation: Boolean!
    showLanguages: Boolean!
    showSkills: Boolean!

    """
    Array of user IDs who are permitted to view this profile
    """
    permittedUsers: [String!]!

    """
    Timestamp when the profile was created
    """
    createdAt: String!

    """
    Timestamp when the profile was last updated
    """
    updatedAt: String!
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
      phone: JSON
      email: String!
      linkedin: String
      portfolio: String
      professionalSummary: String!
      availability: Availability
      workExperience: JSON!
      education: JSON!
      languages: JSON!
      skills: [SkillCategoryInput!]
      accessLevel: AccessLevel!
      showName: Boolean
      showEmail: Boolean
      showPhone: Boolean
      showLinkedIn: Boolean
      showPortfolio: Boolean
      showWorkExperience: Boolean
      showEducation: Boolean
      showLanguages: Boolean
      showSkills: Boolean
      permittedUsers: [String!]
    ): Profile!

    """
    Update an existing profile
    """
    updateProfile(
      id: ID!
      fullName: String
      phone: JSON
      email: String
      linkedin: String
      portfolio: String
      professionalSummary: String
      availability: Availability
      workExperience: JSON
      education: JSON
      languages: JSON
      skills: [SkillCategoryInput!]
      accessLevel: AccessLevel
      showName: Boolean
      showEmail: Boolean
      showPhone: Boolean
      showLinkedIn: Boolean
      showPortfolio: Boolean
      showWorkExperience: Boolean
      showEducation: Boolean
      showLanguages: Boolean
      showSkills: Boolean
      permittedUsers: [String!]
    ): Profile!
  }

  """
  Input type for structured phone number
  """
  input PhoneNumberInput {
    countryCode: String!
    dialCode: String!
    number: String!
    flag: String!
  }

  """
  Input type for a skill item
  """
  input SkillInput {
    skill: String
  }

  """
  Input type for a skill category
  """
  input SkillCategoryInput {
    title: String!
    skills: [SkillInput!]!
  }
`;
