"use client";

import { useRef } from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

/** Paths do monograma NS - `public/logo.svg`. */
export const LOGO_PATHS = [
  "M311 191L312 883L419 960L419 419L883 840L882 1015L645 1016L645 1185L977 1018L977 783L524 370L311 191Z",
  "M511 585L511 725L797 985L839 985L840 883L511 585Z",
  "M649 129L649 253L868 415L869 606L977 701L978 365L649 129Z",
] as const;

const DRAW_EASE = "easeInOut" as const;

type LogoMarkProps = {
  className?: string;
  /**
   * `true` - anima pathLength 0→1 + fillOpacity.
   * `"pending"` - mantém invisível (aguardando boot do globo).
   * `false` - marca já completa (header).
   */
  draw?: boolean | "pending";
  onDrawComplete?: () => void;
};

export function LogoMark({
  className,
  draw = false,
  onDrawComplete,
}: LogoMarkProps) {
  const doneRef = useRef(false);
  const isDrawing = draw === true;
  const isPending = draw === "pending";

  const drawTransition: Transition = {
    pathLength: { duration: 1.45, ease: DRAW_EASE },
    fillOpacity: { duration: 0.7, delay: 0.75, ease: "easeOut" },
    strokeOpacity: { duration: 0.45, delay: 1.15, ease: "easeOut" },
  };

  const target = isPending
    ? { pathLength: 0, fillOpacity: 0, strokeOpacity: 0 }
    : { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1254 1254"
      fill="none"
      aria-hidden
      className={cn("h-full w-full select-none", className)}
    >
      <g>
        {LOGO_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="currentColor"
            stroke="var(--electric)"
            strokeWidth={isDrawing || isPending ? 18 : 0}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={
              isDrawing || isPending
                ? {
                    pathLength: 0,
                    fillOpacity: 0,
                    strokeOpacity: isDrawing ? 1 : 0,
                  }
                : { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }
            }
            animate={
              isDrawing
                ? { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }
                : target
            }
            transition={
              isDrawing
                ? {
                    ...drawTransition,
                    pathLength: {
                      ...drawTransition.pathLength,
                      delay: i * 0.08,
                    },
                    fillOpacity: {
                      ...drawTransition.fillOpacity,
                      delay: 0.75 + i * 0.06,
                    },
                    strokeOpacity: {
                      ...drawTransition.strokeOpacity,
                      delay: 1.15 + i * 0.04,
                    },
                  }
                : { duration: 0 }
            }
            onAnimationComplete={() => {
              if (
                !isDrawing ||
                i !== LOGO_PATHS.length - 1 ||
                doneRef.current
              ) {
                return;
              }
              doneRef.current = true;
              onDrawComplete?.();
            }}
          />
        ))}
      </g>
    </svg>
  );
}
