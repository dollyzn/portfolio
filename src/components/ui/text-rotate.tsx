"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Troca de palavras vertical com blur - nada de máquina de escrever.
 * A largura é reservada pela maior palavra, então o texto ao redor não pula.
 */
export function TextRotate({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced]);

  return (
    <span
      className={cn(
        "relative inline-grid overflow-hidden align-bottom",
        className,
      )}
      aria-live="polite"
    >
      {/* fantasma: reserva a largura do maior item */}
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>

      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            initial={
              reduced
                ? { opacity: 0 }
                : { y: "88%", opacity: 0, filter: "blur(7px)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { y: "0%", opacity: 1, filter: "blur(0px)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { y: "-88%", opacity: 0, filter: "blur(7px)" }
            }
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="text-gradient-accent inline-block whitespace-nowrap"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
