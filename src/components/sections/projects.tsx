"use client";

import { ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ProjectMockup } from "@/components/ui/project-mockup";
import { GithubIcon } from "@/components/ui/icons";
import { getContent, type Project } from "@/content";
import type { AppLocale } from "@/i18n/routing";
import { site } from "@/lib/site";

export function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale() as AppLocale;
  const { featuredProject, projects } = getContent(locale);

  return (
    <Section id="projetos" label={t("label")}>
      <SectionHeader
        index="04"
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("titleLead")}{" "}
            <span className="text-slate-blue">{t("titleAccent")}</span>
          </>
        }
        description={
          <>
            {t("descriptionBefore")}{" "}
            <span className="text-mist">{t("descriptionEmphasis")}</span>{" "}
            {t("descriptionAfter")}
          </>
        }
      />

      <Featured project={featuredProject} />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.07} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          {t("more")}
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-electric transition-colors hover:text-cyan-bright"
          >
            @dollyzn
            <ArrowUpRight className="size-3" strokeWidth={2} />
          </a>
        </p>
      </Reveal>
    </Section>
  );
}

function Featured({ project: p }: { project: Project }) {
  const t = useTranslations("projects");
  const reduced = useReducedMotion();

  return (
    <Reveal>
      <motion.div
        whileHover={reduced ? undefined : { y: -4 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SpotlightCard
          as="article"
          radius={520}
          intensity={0.09}
          className="grid overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.06fr]"
        >
          <div className="order-2 flex flex-col justify-center p-7 sm:p-10 lg:order-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-bright/25 bg-cyan-bright/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-bright">
                {t("featured")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                {p.kind}
              </span>
            </div>

            <h3 className="mt-5 text-[2.1rem] font-medium leading-none tracking-[-0.03em] text-paper sm:text-[2.6rem]">
              {p.name}
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-mist">
              {p.tagline}
            </p>
            <p className="mt-4 max-w-lg text-[14.5px] leading-[1.75] text-slate-blue">
              {p.description}
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-[13px] text-slate-blue"
                >
                  <span
                    aria-hidden
                    className="size-1 shrink-0 rounded-full bg-electric/70"
                  />
                  {f}
                </li>
              ))}
            </ul>

            <StackRow stack={p.stack} />
            <Links project={p} />
          </div>

          <div className="relative order-1 min-h-[240px] border-b border-line sm:min-h-[320px] lg:order-2 lg:min-h-[460px] lg:border-b-0 lg:border-l">
            <ProjectMockup slug={p.slug} />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-void/60 lg:via-transparent"
            />
          </div>
        </SpotlightCard>
      </motion.div>
    </Reveal>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -5 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <SpotlightCard as="article" className="flex h-full flex-col">
        <div className="relative h-40 border-b border-line">
          <ProjectMockup slug={p.slug} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/55 to-transparent"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            {p.kind}
          </span>
          <h3 className="mt-2.5 text-[1.3rem] font-medium tracking-[-0.02em] text-paper">
            {p.name}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-blue">
            {p.description}
          </p>

          <div className="mt-auto">
            <StackRow stack={p.stack} />
            <Links project={p} compact />
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function StackRow({ stack }: { stack: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded border border-line bg-surface px-2 py-1 font-mono text-[10.5px] tracking-tight text-dim"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function Links({
  project: p,
  compact,
}: {
  project: Project;
  compact?: boolean;
}) {
  const t = useTranslations("projects");
  const tA11y = useTranslations("a11y");

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
      <a
        href={p.repo}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={tA11y("projectRepo", { name: p.name })}
        className="group/link inline-flex items-center gap-2 text-[13.5px] text-mist transition-colors duration-300 hover:text-paper"
      >
        <GithubIcon className="size-[15px] opacity-70 transition-opacity group-hover/link:opacity-100" />
        <span className="relative">
          {t("code")}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-electric transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100"
          />
        </span>
      </a>

      {p.demo ? (
        <a
          href={p.demo}
          target="_blank"
          rel="noreferrer noopener"
          className="group/link inline-flex items-center gap-1.5 text-[13.5px] text-mist transition-colors duration-300 hover:text-paper"
        >
          <span className="relative">
            {t("demo")}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-electric transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100"
            />
          </span>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            strokeWidth={1.8}
          />
        </a>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 text-[13px] text-dim"
          title={t("soonTitle")}
        >
          <Lock className="size-3.5" strokeWidth={1.6} />
          {compact ? t("soonCompact") : t("soon")}
        </span>
      )}
    </div>
  );
}
