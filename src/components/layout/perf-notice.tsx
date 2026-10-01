"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Gauge, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePerfMode } from "@/hooks/use-perf-mode";
import {
  dismissPerfNotice,
  setPerfPreference,
  shouldShowPerfNotice,
} from "@/lib/perf-mode";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Deixa a página assentar antes de falar sobre desempenho. */
const DELAY_MS = 1400;

/**
 * Enquanto o navegador estiver sem aceleração fica um indicador no canto -
 * inclusive na versão completa, porque ali é onde a lentidão aparece. Ele
 * abre o painel com o motivo e a troca entre leve e completo; o painel abre
 * sozinho só na primeira vez.
 */
export function PerfNotice({ ready }: { ready: boolean }) {
  const t = useTranslations("perf");
  const perf = usePerfMode();
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const lite = perf.mode === "lite";
  // o indicador também fica no modo leve escolhido à mão, pra ter volta
  const visible = ready && perf.resolved && (perf.trigger !== null || lite);
  const autoOpen = ready && shouldShowPerfNotice(perf);

  useEffect(() => {
    if (!autoOpen) return;
    const id = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, [autoOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible) return null;

  const close = () => {
    dismissPerfNotice();
    setOpen(false);
  };

  const switchTo = (next: "lite" | "full") => {
    setPerfPreference(next);
    setOpen(false);
  };

  const body = !lite
    ? t("bodyFull")
    : perf.trigger === "low-fps"
      ? t("bodyFps")
      : perf.trigger
        ? t("bodyGpu")
        : t("bodyLite");

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.aside
            key="panel"
            data-perf-panel
            role="status"
            aria-live="polite"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-auto relative w-full origin-bottom-right overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_26px_70px_-32px_color-mix(in_oklab,var(--electric)_55%,transparent)] sm:w-[23rem]"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--electric),var(--cyan-bright),transparent)]"
            />

            <div className="flex items-start gap-3 p-4 pb-3">
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-electric/25 bg-electric/[0.08] text-electric"
              >
                <Gauge className="size-[18px]" strokeWidth={1.7} />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  id={titleId}
                  className="text-[13.5px] font-medium text-paper"
                >
                  {lite ? t("title") : t("titleFull")}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slate-blue">
                  {body}
                </p>
                {perf.trigger && perf.renderer ? (
                  <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                    {t("renderer")}: {perf.renderer}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-lg text-dim transition-colors duration-300 hover:bg-surface-2 hover:text-paper"
              >
                <X className="size-3.5" strokeWidth={1.8} />
              </button>
            </div>

            {perf.trigger ? (
              <p className="border-t border-line px-4 py-3 text-[11.5px] leading-relaxed text-dim">
                {t("hint")}
              </p>
            ) : null}

            <div className="flex items-center gap-2 border-t border-line bg-surface px-4 py-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-[12.5px]"
                onClick={() => switchTo(lite ? "full" : "lite")}
              >
                {lite ? t("full") : t("lite")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-[12.5px]"
                onClick={close}
              >
                {t("dismiss")}
              </Button>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="pill"
            type="button"
            data-perf-indicator
            onClick={() => setOpen(true)}
            aria-label={t("details")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="pointer-events-auto inline-flex h-9 origin-bottom-right items-center gap-2 rounded-full border border-line-strong bg-panel px-3 text-dim shadow-[0_16px_40px_-26px_color-mix(in_oklab,var(--electric)_60%,transparent)] transition-colors duration-300 hover:border-electric/35 hover:text-paper"
          >
            <Gauge className="size-3.5 text-electric" strokeWidth={1.8} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
              {lite ? t("badgeLite") : t("badgeFull")}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
