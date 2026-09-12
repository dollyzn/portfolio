"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/ui/logo";
import { useIntro } from "@/components/intro/intro-context";
import { hasGlobeWarmedUp } from "@/lib/boot-gate";

const EASE = [0.16, 1, 0.3, 1] as const;
const LAYOUT_SPRING = { type: "spring" as const, stiffness: 200, damping: 30 };
/** Evita piscar o glow em device que já tem o globo quente. */
const HOLD_DELAY_MS = 250;

/**
 * Estágio central da marca: espera o globo, desenha o SVG e cede o
 * layoutId="brand-logo" para o slot do header (shared layout).
 *
 * Na 1ª visita, se o WebGL demorar, só o glow pulsa no centro.
 * Em reprise (locale / soft nav), a logo fica no header até o globo
 * aquecer de novo - só então voa ao centro e desenha, sem a travada.
 */
export function IntroBrand() {
  const t = useTranslations("intro");
  const { phase, setPhase, reduced } = useIntro();
  const firstVisit = !hasGlobeWarmedUp();
  const waitOnStage = phase === "booting" && firstVisit;
  const [holdVisible, setHoldVisible] = useState(false);
  const [glowSettled, setGlowSettled] = useState(false);

  useEffect(() => {
    if (phase !== "booting" || !firstVisit) return;
    const id = window.setTimeout(() => setHoldVisible(true), HOLD_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase, firstVisit]);

  const holding = waitOnStage && holdVisible;
  const drawing = phase === "drawing";
  const onStage = drawing || holding;

  if (reduced || !onStage) return null;

  return (
    <div
      role={holding ? "status" : undefined}
      aria-live={holding ? "polite" : undefined}
      aria-busy={holding || undefined}
      aria-hidden={holding ? undefined : true}
      className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
    >
      {holding ? <span className="sr-only">{t("loading")}</span> : null}

      <AnimatePresence>
        {holding || drawing ? (
          <motion.div
            key="intro-glow"
            initial={{ opacity: 0 }}
            animate={
              drawing
                ? { opacity: 1 }
                : glowSettled
                  ? { opacity: [0.38, 0.58, 0.38] }
                  : { opacity: 0.48 }
            }
            exit={{ opacity: 0 }}
            transition={
              drawing
                ? { duration: 0.8, ease: EASE }
                : glowSettled
                  ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.9, ease: EASE }
            }
            onAnimationComplete={() => {
              if (!drawing) setGlowSettled(true);
            }}
            aria-hidden
            className="absolute left-1/2 top-1/2 size-[22rem] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-navy),transparent_68%)] blur-3xl"
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId="brand-logo"
        transition={LAYOUT_SPRING}
        className="relative h-28 w-28 text-paper sm:h-36 sm:w-36"
      >
        <AnimatePresence>
          {drawing ? (
            <motion.span
              key="logo-bloom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-2xl sm:size-32"
            />
          ) : null}
        </AnimatePresence>
        {drawing ? (
          <LogoMark
            draw
            className="drop-shadow-[0_0_22px_color-mix(in_oklab,var(--electric)_40%,transparent)]"
            onDrawComplete={() => setPhase("moving")}
          />
        ) : null}
      </motion.div>

      <AnimatePresence>
        {drawing ? (
          <motion.div
            key="brand-signature"
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.55, delay: 0.55, ease: EASE }}
            className="mt-8 flex flex-col items-center text-center"
          >
            <p className="text-[13px] font-medium tracking-[0.32em] text-paper sm:text-sm">
              {t("name")}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
              {t("role")}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
