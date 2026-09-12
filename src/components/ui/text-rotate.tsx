"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ROTATE_EASE = [0.16, 1, 0.3, 1] as const;

export type TextRotateIntro = {
  delay?: number;
  stagger?: number;
  disableAnimation?: boolean;
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: Transition;
};

/**
 * Troca de palavras vertical com blur - nada de máquina de escrever.
 * A largura é reservada pela maior palavra, então o texto ao redor não pula.
 * `intro` faz a primeira palavra entrar letra a letra, no mesmo ritmo do hero.
 */
export function TextRotate({
  words,
  interval = 2600,
  className,
  intro,
}: {
  words: string[];
  interval?: number;
  className?: string;
  intro?: TextRotateIntro;
}) {
  const [i, setI] = useState(0);
  const [hasRotated, setHasRotated] = useState(false);
  const reduced = useReducedMotion();
  const splitFirst = Boolean(intro) && !intro?.disableAnimation && !reduced;
  const firstWord = words[0] ?? "";
  const showSplit = splitFirst && !hasRotated && i === 0;

  useEffect(() => {
    if (reduced) return;

    const firstChars = Array.from(firstWord).length;
    const staggerMs = (intro?.stagger ?? 0.05) * 1000;
    const durationMs =
      typeof intro?.transition?.duration === "number"
        ? intro.transition.duration * 1000
        : 400;
    const introMs = splitFirst
      ? (intro?.delay ?? 0) +
        Math.max(0, firstChars - 1) * staggerMs +
        durationMs
      : 0;

    if (splitFirst && !hasRotated) {
      const id = window.setTimeout(() => {
        setHasRotated(true);
        setI((v) => (v + 1) % words.length);
      }, introMs + interval);
      return () => window.clearTimeout(id);
    }

    const id = window.setInterval(
      () => setI((v) => (v + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [
    firstWord,
    hasRotated,
    interval,
    intro?.delay,
    intro?.stagger,
    intro?.transition?.duration,
    reduced,
    splitFirst,
    words.length,
  ]);

  const rotateInitial = reduced
    ? { opacity: 0 }
    : { y: "88%", opacity: 0, filter: "blur(7px)" };
  const rotateAnimate = reduced
    ? { opacity: 1 }
    : { y: "0%", opacity: 1, filter: "blur(0px)" };
  const rotateExit = reduced
    ? { opacity: 0 }
    : { y: "-88%", opacity: 0, filter: "blur(7px)" };

  return (
    <span
      className={cn(
        "relative inline-grid align-bottom",
        !showSplit && "overflow-hidden",
        className,
      )}
      aria-live="polite"
    >
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>

      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="wait">
          {showSplit ? (
            <motion.span
              key={`split-${firstWord}`}
              exit={rotateExit}
              transition={{ duration: 0.62, ease: ROTATE_EASE }}
              className="inline-block whitespace-nowrap"
            >
              {Array.from(firstWord).map((ch, ci) => (
                <motion.span
                  key={`${firstWord}-${ci}`}
                  initial={
                    intro?.initial ?? { opacity: 0, filter: "blur(8px)", y: 0 }
                  }
                  animate={
                    intro?.animate ?? { opacity: 1, filter: "blur(0px)", y: 0 }
                  }
                  transition={{
                    ...(intro?.transition ?? {
                      duration: 0.4,
                      ease: ROTATE_EASE,
                    }),
                    delay:
                      (intro?.delay ?? 0) / 1000 +
                      ci * (intro?.stagger ?? 0.028),
                  }}
                  className="text-gradient-accent inline-block whitespace-pre"
                >
                  {ch}
                </motion.span>
              ))}
            </motion.span>
          ) : (
            <motion.span
              key={words[i]}
              initial={rotateInitial}
              animate={rotateAnimate}
              exit={rotateExit}
              transition={{ duration: 0.62, ease: ROTATE_EASE }}
              className="text-gradient-accent inline-block whitespace-nowrap"
            >
              {words[i]}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}
