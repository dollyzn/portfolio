"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Entrada padrão do site: sobe, desfoca e ganha nitidez. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  blur = 8,
  duration = 0.8,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }
      }
      whileInView={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-12% 0px -10% 0px" }}
      transition={{ duration: reduced ? 0.3 : duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? staggerItemReduced : staggerItem}
    >
      {children}
    </motion.div>
  );
}

/**
 * Text reveal por palavra - usado só no Hero e no CTA final,
 * para não competir com a leitura do resto da página.
 */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: EASE },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
