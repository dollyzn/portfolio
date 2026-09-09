"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { experiences, type Experience } from "@/lib/content";
import { cn } from "@/lib/utils";

const VISIBLE = 3;

export function ExperienceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <Section id="experiencia" label="Experiência profissional">
      <SectionHeader
        index="03"
        eyebrow="Experiência"
        title={
          <>
            Do rack de servidores{" "}
            <span className="text-slate-blue">ao deploy em produção.</span>
          </>
        }
        description="Uma linha razoavelmente direta: comecei consertando o que já existia, passei a construir para a web e hoje trabalho nas duas pontas da aplicação."
      />

      <div ref={trackRef} className="relative">
        {/* trilho da timeline */}
        <div
          aria-hidden
          className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-white/[0.1] sm:block"
        >
          <motion.div
            style={{ scaleY: progress }}
            className="h-full w-px origin-top bg-gradient-to-b from-cyan-bright via-electric to-blue-600"
          />
        </div>

        <ol className="space-y-4 sm:space-y-0 sm:pl-10">
          {experiences.map((job, i) => (
            <li key={job.company}>
              <ExperienceItem job={job} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function ExperienceItem({ job, index }: { job: Experience; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const rest = job.highlights.slice(VISIBLE);
  const id = `exp-${job.company.split(" ")[0].toLowerCase()}`;

  return (
    <Reveal delay={index * 0.05}>
      <article className="group relative border-b border-white/[0.06] py-9 last:border-b-0 sm:py-11">
        {/* nó na timeline */}
        <span
          aria-hidden
          className="absolute -left-10 top-[3.3rem] z-10 hidden size-2.5 -translate-x-[45%] items-center justify-center sm:flex"
        >
          <span className="absolute size-2.5 rounded-full bg-void ring-1 ring-inset ring-slate-blue/50 transition-all duration-500 group-hover:ring-cyan-bright" />
          <span className="absolute size-1 rounded-full bg-electric transition-all duration-500 group-hover:bg-cyan-bright group-hover:shadow-[0_0_10px_2px_rgba(114,222,254,0.7)]" />
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-electric">
            {job.period}
          </span>
          <span aria-hidden className="h-px w-5 bg-white/10" />
          <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            {job.stage}
          </span>
        </div>

        <h3 className="mt-4 text-[1.65rem] font-medium leading-tight tracking-[-0.025em] text-paper sm:text-[1.9rem]">
          {job.role}
        </h3>
        <p className="mt-1 text-[15px] text-mist">{job.company}</p>

        <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-slate-blue">
          {job.summary}
        </p>

        <ul className="mt-6 max-w-2xl space-y-2.5">
          {job.highlights.slice(0, VISIBLE).map((h) => (
            <Bullet key={h}>{h}</Bullet>
          ))}
        </ul>

        <AnimatePresence initial={false}>
          {expanded && rest.length > 0 ? (
            <motion.div
              id={id}
              key="rest"
              initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={
                reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }
              }
              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="max-w-2xl space-y-2.5 pt-2.5">
                {rest.map((h) => (
                  <Bullet key={h}>{h}</Bullet>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ul className="flex flex-wrap gap-x-2 gap-y-2">
            {job.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-white/[0.06] px-2 py-1 font-mono text-[11px] tracking-tight text-dim transition-colors duration-300 hover:border-electric/30 hover:text-mist"
              >
                {s}
              </li>
            ))}
          </ul>

          {rest.length > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={id}
              className="inline-flex items-center gap-1.5 text-[13px] text-slate-blue transition-colors duration-300 hover:text-electric"
            >
              {expanded
                ? "Ver menos"
                : `Ver mais ${rest.length} ${rest.length === 1 ? "item" : "itens"}`}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-400",
                  expanded && "rotate-180",
                )}
                strokeWidth={1.8}
              />
            </button>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[14.5px] leading-relaxed text-mist/85">
      <span
        aria-hidden
        className="mt-[0.6em] size-1 shrink-0 rounded-full bg-electric/60"
      />
      <span>{children}</span>
    </li>
  );
}
