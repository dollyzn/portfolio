"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useIsInView, type UseIsInViewOptions } from "@/hooks/use-is-in-view";
import { cn } from "@/lib/utils";

type HighlightTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  delay?: number;
} & UseIsInViewOptions;

function HighlightText({
  ref,
  text,
  className,
  style,
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  transition = { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  delay = 0,
  ...props
}: HighlightTextProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLSpanElement>,
    { inView, inViewOnce, inViewMargin },
  );

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      initial={{ backgroundSize: "0% 100%" }}
      animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
      transition={{
        ...transition,
        delay: (transition?.delay ?? 0) + delay / 1000,
      }}
      className={cn(
        "inline rounded-[3px] px-0.5 text-paper [background-image:linear-gradient(120deg,color-mix(in_oklab,var(--electric)_26%,transparent),color-mix(in_oklab,var(--cyan-bright)_14%,transparent))]",
        className,
      )}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        ...style,
      }}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
