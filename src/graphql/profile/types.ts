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
  fieldOfStudy: string;
  dateFrom: string;
  dateTo: string;
  description: string;
};

export type Language = {
  language: string;
  fluencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
};

export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
};

export type PhoneNumber = {
  countryCode: string;
  dialCode: string;
  number: string;
  flag: string;
};

export type Availability = 'available' | 'open' | 'unavailable';

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
  skills?: Skill[];
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
  skills?: Skill[];
};
