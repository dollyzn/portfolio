import type { AppLocale } from "@/i18n/routing";
import { contentEn } from "./en";
import { contentPt } from "./pt";
import type { LocaleContent } from "./types";

const catalog: Record<AppLocale, LocaleContent> = {
  pt: contentPt,
  en: contentEn,
};

export function getContent(locale: AppLocale): LocaleContent {
  return catalog[locale] ?? catalog.pt;
}

export type {
  EducationItem,
  Experience,
  LanguageItem,
  LocaleContent,
  Principle,
  Project,
  Tech,
  TechCategory,
} from "./types";
