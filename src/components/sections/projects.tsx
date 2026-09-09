"use client";

import { ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ProjectMockup } from "@/components/ui/project-mockup";
import { GithubIcon } from "@/components/ui/icons";
import { featuredProject, projects, type Project } from "@/lib/content";

export function Projects() {
  return (
    <Section id="projetos" label="Projetos">
      <SectionHeader
        index="04"
        eyebrow="Projetos"
        title={
          <>
            Coisas que eu construí{" "}
            <span className="text-slate-blue">para entender melhor.</span>
          </>
        }
        description={
          <>
            Os projetos abaixo são{" "}
            <span className="text-mist">pessoais e conceituais</span> - eu os
            uso para estudar arquitetura e testar decisões técnicas. Trabalhos
            profissionais estão descritos na seção de experiência.
          </>
        }
      />

      <Featured />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.07} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
          <span aria-hidden className="h-px w-8 bg-white/10" />
          Mais projetos no GitHub
          <a
            href="https://github.com/dollyzn"
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

function Featured() {
  const reduced = useReducedMotion();
  const p = featuredProject;

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
                Em destaque
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

          <div className="relative order-1 min-h-[240px] border-b border-white/[0.06] sm:min-h-[320px] lg:order-2 lg:min-h-[460px] lg:border-b-0 lg:border-l">
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
        <div className="relative h-40 border-b border-white/[0.06]">
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
          className="rounded border border-white/[0.06] bg-white/[0.015] px-2 py-1 font-mono text-[10.5px] tracking-tight text-dim"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

/** Troque `repo` / `demo` em `src/lib/content.ts` pelas URLs reais. */
function Links({
  project: p,
  compact,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.05] pt-5">
      <a
        href={p.repo}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Repositório de ${p.name} no GitHub (abre em nova aba)`}
        className="group/link inline-flex items-center gap-2 text-[13.5px] text-mist transition-colors duration-300 hover:text-paper"
      >
        <GithubIcon className="size-[15px] opacity-70 transition-opacity group-hover/link:opacity-100" />
        <span className="relative">
          Código
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
            Live demo
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
          title="Demo ainda não publicada"
        >
          <Lock className="size-3.5" strokeWidth={1.6} />
          {compact ? "Em breve" : "Demo em breve"}
        </span>
      )}
    </div>
  );
}
