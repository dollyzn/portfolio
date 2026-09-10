"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntro } from "@/components/intro/intro-context";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const stops = [
  { id: "top", index: "00", key: "top" },
  { id: "sobre", index: "01", key: "sobre" },
  { id: "stack", index: "02", key: "stack" },
  { id: "experiencia", index: "03", key: "experiencia" },
  { id: "projetos", index: "04", key: "projetos" },
  { id: "principios", index: "05", key: "principios" },
  { id: "formacao", index: "06", key: "formacao" },
  { id: "contato", index: "07", key: "contato" },
] as const;

const ids = stops.map((s) => s.id);

/** Trilha lateral de navegação: só aparece em telas largas. */
export function SectionRail() {
  const t = useTranslations("rail");
  const tA11y = useTranslations("a11y");
  const active = useActiveSection(ids);
  const reduced = useReducedMotion();
  const { isRevealing, reduced: introReduced } = useIntro();
  const visible = isRevealing || introReduced;

  return (
    <motion.nav
      aria-label={tA11y("railNav")}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, delay: visible ? 0.5 : 0 }}
      className={cn(
        "fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block",
        !visible && "pointer-events-none",
      )}
    >
      <ul className="flex flex-col items-end gap-3.5">
        {stops.map((stop) => {
          const isActive = active === stop.id;
          const label = t(stop.key);
          return (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 rounded-sm py-0.5"
              >
                <span
                  className={cn(
                    "font-mono text-[9.5px] uppercase tracking-[0.2em] transition-all duration-500",
                    isActive
                      ? "text-electric opacity-100"
                      : "text-dim opacity-0 group-hover:opacity-100",
                  )}
                >
                  {stop.index} / {label}
                </span>
                <span className="relative flex h-3 w-6 items-center justify-end">
                  <motion.span
                    layout={!reduced}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "block h-px transition-colors duration-500",
                      isActive
                        ? "w-6 bg-electric"
                        : "w-2.5 bg-line-strong group-hover:w-4 group-hover:bg-electric/60",
                    )}
                  />
                </span>
                <span className="sr-only">{t("goto", { label })}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
