"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Três traços que viram um X. O morph fica no mesmo botão,
 * sem trocar ícone do lucide no meio do clique.
 */
export function MenuToggle({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : { duration: 0.38, ease: EASE };

  return (
    <span className={cn("relative block size-5", className)} aria-hidden>
      <motion.span
        className="absolute left-[3px] top-[5px] h-[1.5px] w-[14px] origin-center rounded-full bg-current"
        animate={open ? { y: 4.25, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className="absolute left-[3px] top-[9.25px] h-[1.5px] w-[14px] origin-center rounded-full bg-current"
        animate={
          open ? { opacity: 0, scaleX: 0.35 } : { opacity: 1, scaleX: 1 }
        }
        transition={transition}
      />
      <motion.span
        className="absolute left-[3px] top-[13.5px] h-[1.5px] w-[14px] origin-center rounded-full bg-current"
        animate={open ? { y: -4.25, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </span>
  );
}
