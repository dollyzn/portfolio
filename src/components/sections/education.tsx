"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCap, Languages } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { getContent } from "@/content";
import type { AppLocale } from "@/i18n/routing";

export function Education() {
  const t = useTranslations("education");
  const locale = useLocale() as AppLocale;
  const { education, languages } = getContent(locale);
  const reduced = useReducedMotion();

  return (
    <Section id="formacao" label={t("label")}>
      <SectionHeader
        index="06"
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("titleLead")}{" "}
            <span className="text-slate-blue">{t("titleAccent")}</span>
          </>
        }
      />

      <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div>
          <SubTitle
            icon={<GraduationCap className="size-3.5" strokeWidth={1.7} />}
          >
            {t("subtitleSchool")}
          </SubTitle>

          <ul className="mt-7">
            {education.map((e, i) => (
              <li key={e.institution}>
                <Reveal delay={i * 0.07}>
                  <div className="group flex flex-col gap-1.5 border-t border-line py-6 transition-colors duration-500 hover:border-electric/25 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                    <div>
                      <h4 className="text-[1.05rem] font-medium text-paper">
                        {e.course}
                      </h4>
                      <p className="mt-1 text-[14px] text-slate-blue">
                        {e.institution}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-electric">
                        {e.period}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                        {e.status}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SubTitle icon={<Languages className="size-3.5" strokeWidth={1.7} />}>
            {t("subtitleLanguages")}
          </SubTitle>

          <ul className="mt-7 space-y-7">
            {languages.map((l, i) => (
              <li key={l.name}>
                <Reveal delay={i * 0.08}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[15px] text-paper">{l.name}</span>
                    <span className="text-[13px] text-slate-blue">
                      {l.level}
                    </span>
                  </div>
                  <div className="mt-3 h-px w-full bg-line">
                    <motion.div
                      initial={
                        reduced ? { scaleX: l.value / 100 } : { scaleX: 0 }
                      }
                      whileInView={{ scaleX: l.value / 100 }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{
                        duration: 1.2,
                        delay: 0.15 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="h-px origin-left bg-gradient-to-r from-blue-600 via-electric to-cyan-bright shadow-[0_0_10px_rgba(76,177,252,0.5)]"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <p className="mt-10 border-l border-line-strong pl-5 text-[14px] leading-relaxed text-dim">
              {t("note")}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function SubTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Reveal>
      <h3 className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-electric">
        {icon}
        {children}
      </h3>
    </Reveal>
  );
}
