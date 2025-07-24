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

export type CreateProfileArgs = {
  id: string;
  fullName: string;
  phone?: string;
  email: string;
  linkedin?: string;
  portfolio?: string;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  languages: Language[];
};

export type UpdateProfileArgs = {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  portfolio?: string;
  professionalSummary?: string;
  workExperience?: WorkExperience[];
  education?: Education[];
  languages?: Language[];
};
