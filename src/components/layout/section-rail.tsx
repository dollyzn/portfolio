"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const stops = [
  { id: "top", index: "00", label: "Início" },
  { id: "sobre", index: "01", label: "Sobre" },
  { id: "stack", index: "02", label: "Stack" },
  { id: "experiencia", index: "03", label: "Experiência" },
  { id: "projetos", index: "04", label: "Projetos" },
  { id: "principios", index: "05", label: "Princípios" },
  { id: "formacao", index: "06", label: "Formação" },
  { id: "contato", index: "07", label: "Contato" },
] as const;

const ids = stops.map((s) => s.id);

/** Trilha lateral de navegação: só aparece em telas largas. */
export function SectionRail() {
  const active = useActiveSection(ids);
  const reduced = useReducedMotion();

  return (
    <nav
      aria-label="Índice das seções"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col items-end gap-3.5">
        {stops.map((stop) => {
          const isActive = active === stop.id;
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
                  {stop.index} / {stop.label}
                </span>
                <span className="relative flex h-3 w-6 items-center justify-end">
                  <motion.span
                    layout={!reduced}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "block h-px transition-colors duration-500",
                      isActive
                        ? "w-6 bg-electric"
                        : "w-2.5 bg-white/20 group-hover:w-4 group-hover:bg-electric/60",
                    )}
                  />
                </span>
                <span className="sr-only">
                  Ir para a seção {stop.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
