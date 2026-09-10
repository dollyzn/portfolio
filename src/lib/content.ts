/**
 * @deprecated Use `@/content` (`getContent(locale)`) instead.
 * Re-export mantido temporariamente para imports legados.
 */
export {
  getContent,
  type EducationItem,
  type Experience,
  type LanguageItem,
  type Principle,
  type Project,
  type Tech,
  type TechCategory,
} from "@/content";

import { contentPt } from "@/content/pt";

/** @deprecated Prefer getContent(locale) */
export const experiences = contentPt.experiences;
/** @deprecated Prefer getContent(locale) */
export const primaryTech = contentPt.primaryTech;
/** @deprecated Prefer getContent(locale) */
export const secondaryTech = contentPt.secondaryTech;
/** @deprecated Prefer getContent(locale) */
export const stackTopics = contentPt.stackTopics;
/** @deprecated Prefer getContent(locale) */
export const featuredProject = contentPt.featuredProject;
/** @deprecated Prefer getContent(locale) */
export const projects = contentPt.projects;
/** @deprecated Prefer getContent(locale) */
export const principles = contentPt.principles;
/** @deprecated Prefer getContent(locale) */
export const education = contentPt.education;
/** @deprecated Prefer getContent(locale) */
export const languages = contentPt.languages;
