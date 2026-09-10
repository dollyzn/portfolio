"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/ui/logo";
import { useIntro } from "@/components/intro/intro-context";
import { hasGlobeWarmedUp } from "@/lib/boot-gate";

const EASE = [0.16, 1, 0.3, 1] as const;
const LAYOUT_SPRING = { type: "spring" as const, stiffness: 200, damping: 30 };

/**
 * Estágio central da marca: espera o globo, desenha o SVG e cede o
 * layoutId="brand-logo" para o slot do header (shared layout).
 *
 * Na 1ª visita, espera o WebGL no centro (página ainda escondida).
 * Em reprise (locale / soft nav), a logo fica no header até o globo
 * aquecer de novo — só então voa ao centro e desenha, sem a travada.
 */
export function IntroBrand() {
  const t = useTranslations("intro");
  const { phase, setPhase, reduced } = useIntro();
  const waitOnStage = phase === "booting" && !hasGlobeWarmedUp();
  const onStage = phase === "drawing" || waitOnStage;

  if (reduced || !onStage) return null;

  const drawing = phase === "drawing";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
      aria-hidden
    >
      <AnimatePresence>
        {drawing ? (
          <motion.div
            key="intro-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
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
        <LogoMark
          key={drawing ? "draw" : "boot"}
          draw={drawing ? true : "pending"}
          className={
            drawing
              ? "drop-shadow-[0_0_22px_color-mix(in_oklab,var(--electric)_40%,transparent)]"
              : undefined
          }
          onDrawComplete={() => setPhase("moving")}
        />
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
