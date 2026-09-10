"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { TechGlyph } from "@/components/ui/tech-glyph";
import { getContent, type Tech } from "@/content";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Stack() {
  const t = useTranslations("stack");
  const locale = useLocale() as AppLocale;
  const { primaryTech, secondaryTech, stackTopics } = getContent(locale);

  return (
    <Section id="stack" label={t("label")}>
      <SectionHeader
        index="02"
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("titleLead")}{" "}
            <span className="text-slate-blue">{t("titleAccent")}</span>
          </>
        }
        description={t("description")}
      />

      <PrimaryGrid techs={primaryTech} />
      <SecondaryRow techs={secondaryTech} label={t("secondary")} />
      <Topics topics={stackTopics} label={t("topics")} />
      <Marquee primary={primaryTech} secondary={secondaryTech} />
    </Section>
  );
}

/* ── grade principal: matriz 3×3 em hairlines ─────────────────── */

function PrimaryGrid({ techs }: { techs: Tech[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const node = ref.current;
    if (!node || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--gx", `${clientX - rect.left}px`);
      node.style.setProperty("--gy", `${clientY - rect.top}px`);
    });
  };

  return (
    <Reveal>
      <div
        ref={ref}
        onMouseMove={handleMove}
        className="group/grid relative isolate overflow-hidden rounded-2xl border border-line"
      >
        {/* brilho único acompanhando o cursor na grade inteira */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100"
          style={{
            background:
              "radial-gradient(340px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in oklab, var(--electric) 9%, transparent), transparent 70%)",
          }}
        />

        <ul className="grid grid-cols-3">
          {techs.map((tech, i) => (
            <li key={tech.name}>
              <TechCell tech={tech} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function TechCell({ tech, index }: { tech: Tech; index: number }) {
  const t = useTranslations("stack");
  const reduced = useReducedMotion();
  const col = index % 3;
  const row = Math.floor(index / 3);

  return (
    <motion.div
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }
      }
      whileInView={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.6,
        delay: (col + row) * 0.055,
        ease: EASE,
      }}
      className={cn(
        "group/cell relative flex h-full flex-col items-center justify-center gap-3 px-3 py-8 text-center transition-colors duration-500 hover:bg-electric/[0.035] sm:gap-4 sm:py-12",
        col < 2 && "border-r border-line",
        row < 2 && "border-b border-line",
      )}
    >
      {/* cantos que aparecem no hover */}
      <Corner className="left-2 top-2 border-l border-t" />
      <Corner className="right-2 top-2 border-r border-t" />
      <Corner className="bottom-2 left-2 border-b border-l" />
      <Corner className="bottom-2 right-2 border-b border-r" />

      <span className="relative block">
        <TechGlyph
          icon={tech.icon}
          className="size-8 text-mist transition-all duration-500 group-hover/cell:scale-110 group-hover/cell:text-cyan-bright group-hover/cell:drop-shadow-[0_0_14px_color-mix(in_oklab,var(--cyan-bright)_55%,transparent)] motion-reduce:group-hover/cell:scale-100 sm:size-10"
        />
      </span>

      <span className="flex flex-col items-center gap-1">
        <span className="text-[13px] font-medium tracking-tight text-slate-blue transition-colors duration-400 group-hover/cell:text-paper sm:text-[14.5px]">
          {tech.name}
        </span>

        {/* categoria + nota entram no hover, sem empurrar o layout */}
        <span className="relative h-4 w-full">
          <span className="absolute inset-x-0 top-0 translate-y-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-electric opacity-0 transition-all duration-400 group-hover/cell:translate-y-0 group-hover/cell:opacity-100 sm:text-[10px]">
            {t(`categories.${tech.category}`)}
          </span>
        </span>
      </span>

      <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] tracking-[0.14em] text-dim/35 transition-colors duration-500 group-hover/cell:text-electric/40">
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-2.5 border-cyan-bright/45 opacity-0 transition-opacity duration-400 group-hover/cell:opacity-100",
        className,
      )}
    />
  );
}

/* ── segunda linha: ferramentas de apoio ──────────────────────── */

function SecondaryRow({ techs, label }: { techs: Tech[]; label: string }) {
  return (
    <Reveal delay={0.08}>
      <div className="mt-10">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
          {label}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {techs.map((tech) => (
            <li key={tech.name}>
              <span
                title={tech.note}
                className="group/tag inline-flex cursor-default select-none items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 transition-all duration-300 hover:-translate-y-px hover:border-electric/40 hover:bg-electric/[0.06] hover:shadow-[0_0_22px_-8px_color-mix(in_oklab,var(--electric)_70%,transparent)] motion-reduce:hover:translate-y-0"
              >
                <TechGlyph
                  icon={tech.icon}
                  className="size-[17px] text-slate-blue transition-colors duration-300 group-hover/tag:text-cyan-bright"
                />
                <span className="text-[13px] text-mist transition-colors duration-300 group-hover/tag:text-paper">
                  {tech.name}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function Topics({ topics, label }: { topics: string[]; label: string }) {
  return (
    <Reveal delay={0.12}>
      <div className="mt-12 border-t border-line pt-8">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
          {label}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {topics.map((topic) => (
            <li
              key={topic}
              className="group flex items-center gap-2 text-[13.5px] text-slate-blue transition-colors duration-300 hover:text-mist"
            >
              <span
                aria-hidden
                className="size-1 rounded-full bg-electric/45 transition-colors duration-300 group-hover:bg-cyan-bright"
              />
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ── marquee lento na borda inferior da seção ─────────────────── */

function Marquee({
  primary,
  secondary,
}: {
  primary: Tech[];
  secondary: Tech[];
}) {
  const all = [...primary, ...secondary];
  const track = [...all, ...all];

  return (
    <Reveal delay={0.16}>
      <div
        aria-hidden
        className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="animate-marquee flex w-max items-center gap-12 opacity-45 transition-opacity duration-500 hover:opacity-80">
          {track.map((tech, i) => (
            <span
              key={`${tech.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5"
            >
              <TechGlyph icon={tech.icon} className="size-4 text-slate-blue" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
                {tech.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
