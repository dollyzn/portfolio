"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Marca NS - proporção original 412 × 640. */
export function LogoMark({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-mark.webp"
      alt=""
      aria-hidden
      width={412}
      height={640}
      priority={priority}
      loading="eager"
      className={cn("h-full w-auto select-none object-contain", className)}
    />
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn("group/logo inline-flex items-center gap-2.5", className)}
    >
      <motion.span
        className="relative block h-7"
        initial={reduced ? false : { opacity: 0, scale: 0.85, y: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <LogoMark
          priority
          className="drop-shadow-[0_0_10px_rgba(76,177,252,0.28)] transition-[filter] duration-500 group-hover/logo:drop-shadow-[0_0_16px_rgba(114,222,254,0.6)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 opacity-0 blur-lg transition-opacity duration-500 group-hover/logo:opacity-100"
        />
      </motion.span>

      {showWordmark ? (
        <span className="text-[15px] font-medium tracking-[-0.02em] text-paper">
          NATÃ
          <span className="text-electric">.</span>
        </span>
      ) : null}
    </span>
  );
}
