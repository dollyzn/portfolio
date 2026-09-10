export type Experience = {
  company: string;
  role: string;
  period: string;
  stage: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type TechCategory = "Frontend" | "Backend" | "Ferramentas";

export type Tech = {
  name: string;
  icon: string;
  category: TechCategory;
  note: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: string;
  features: string[];
  stack: string[];
  repo: string;
  demo: string | null;
  accent: "blue" | "cyan" | "navy";
};

export type Principle = {
  index: string;
  title: string;
  body: string;
};

export type EducationItem = {
  institution: string;
  course: string;
  period: string;
  status: string;
};

export type LanguageItem = {
  name: string;
  level: string;
  value: number;
};

export type LocaleContent = {
  experiences: Experience[];
  primaryTech: Tech[];
  secondaryTech: Tech[];
  stackTopics: string[];
  featuredProject: Project;
  projects: Project[];
  principles: Principle[];
  education: EducationItem[];
  languages: LanguageItem[];
};
