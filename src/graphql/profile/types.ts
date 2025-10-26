export type WorkExperience = {
  jobTitle: string;
  companyName: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  responsibilities: string;
};

export type Education = {
  schoolName: string;
  degree: string;
  dateFrom: string;
  dateTo: string;
  description: string;
};

export type Language = {
  language: string;
  fluencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
};

export type Skill = {
  skill?: string;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export type PhoneNumber = {
  countryCode: string;
  dialCode: string;
  number: string;
  flag: string;
};

export type Availability = 'available' | 'open' | 'unavailable';

export type AccessLevel = 'public' | 'private' | 'restricted';

export type CreateProfileArgs = {
  id: string;
  fullName: string;
  phone?: string | PhoneNumber;
  email: string;
  linkedin?: string;
  portfolio?: string;
  professionalSummary: string;
  availability?: Availability;
  workExperience: WorkExperience[];
  education: Education[];
  languages: Language[];
  skills?: SkillCategory[];
  accessLevel: AccessLevel;
  showName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showLinkedIn?: boolean;
  showPortfolio?: boolean;
  showWorkExperience?: boolean;
  showEducation?: boolean;
  showLanguages?: boolean;
  showSkills?: boolean;
  permittedUsers?: string[];
  accessRequests?: string[];
};

export type UpdateProfileArgs = {
  id: string;
  fullName?: string;
  phone?: string | PhoneNumber;
  email?: string;
  linkedin?: string;
  portfolio?: string;
  professionalSummary?: string;
  availability?: Availability;
  workExperience?: WorkExperience[];
  education?: Education[];
  languages?: Language[];
  skills?: SkillCategory[];
  accessLevel?: AccessLevel;
  showName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showLinkedIn?: boolean;
  showPortfolio?: boolean;
  showWorkExperience?: boolean;
  showEducation?: boolean;
  showLanguages?: boolean;
  showSkills?: boolean;
  permittedUsers?: string[];
  accessRequests?: string[];
};
