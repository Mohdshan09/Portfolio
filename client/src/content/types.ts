// Local content shapes mirroring specs/01-database.md — this file goes away once
// Module 1 (shared Zod schemas) and Module 2 (API) exist; these types keep the mock
// data structured so wiring to the real API later is a drop-in swap.

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  resumeUrl: string;
  availableForWork: boolean;
}

export type SkillCategory = 'language' | 'framework' | 'database' | 'tool' | 'concept';

export interface SkillGroup {
  category: SkillCategory;
  items: string[];
}

export type ExperienceType = 'internship' | 'full-time' | 'freelance';

export interface Experience {
  company: string;
  role: string;
  type: ExperienceType;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  techStack: string[];
  liveUrl?: string;
}

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  role: string;
  techStack: string[];
  highlights: string[];
  startDate: string;
  endDate: string | null;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export interface Publication {
  title: string;
  venue: string;
  volume?: string;
  issue?: string;
  date: string;
  summary: string;
  bullets: string[];
  certificateUrl?: string;
  paperUrl?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  startYear: number;
  endYear: number;
  score?: string;
}
