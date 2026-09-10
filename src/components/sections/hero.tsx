"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntro } from "@/components/intro/intro-context";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TextRotate } from "@/components/ui/text-rotate";
import { SplittingText } from "@/components/animate-ui/primitives/texts/splitting";
import { HeroVisual } from "@/components/sections/hero-visual";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHAR_INITIAL = {
  opacity: 0,
  filter: "blur(8px)",
  x: 0,
  y: 0,
} as const;

const CHAR_ANIMATE = {
  opacity: 1,
  filter: "blur(0px)",
  x: 0,
  y: 0,
} as const;

const CHAR_TRANSITION = {
  duration: 0.4,
  ease: EASE,
} as const;

const reveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)", scale: 0.98 },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
};

export function Hero() {
  const t = useTranslations("hero");
  const tA11y = useTranslations("a11y");
  const reduced = useReducedMotion();
  const {
    isRevealing,
    isComplete,
    setPhase,
    reduced: introReduced,
  } = useIntro();
  const active = isRevealing || introReduced;
  const ref = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const rotateWords = t.raw("rotate") as string[];
  const nameText = t("name");
  const verbText = t("verb");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 90, damping: 22, mass: 0.4 });

  const glowX = useTransform(sx, (v) => v * 46);
  const glowY = useTransform(sy, (v) => v * 34);
  const ringX = useTransform(sx, (v) => v * 34);
  const ringY = useTransform(sy, (v) => v * 26);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  useEffect(() => {
    if (!isRevealing || isComplete || completedRef.current) return;
    const id = window.setTimeout(() => {
      completedRef.current = true;
      setPhase("complete");
    }, 1100);
    return () => window.clearTimeout(id);
  }, [isRevealing, isComplete, setPhase]);

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      aria-label={tA11y("heroSection")}
      className="noise-overlay relative isolate flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24"
    >
      <HeroBackdrop glowX={glowX} glowY={glowY} />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div>
          <motion.div
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            variants={reveal}
            transition={{ duration: 0.55, delay: 0, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-4"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-bright opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-cyan-bright" />
            </span>
            <span className="text-[12.5px] tracking-tight text-mist">
              {t("availability")}
            </span>
          </motion.div>

          <h1 className="mt-7 text-[2.6rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.1rem]">
            <motion.span
              initial="hidden"
              animate={active ? "visible" : "hidden"}
              variants={reveal}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
              className="block pb-[0.06em] text-[0.42em] font-normal tracking-[0.02em] text-slate-blue"
            >
              {t("greeting")}
            </motion.span>

            <span className="block overflow-hidden pb-[0.06em]">
              {active ? (
                <SplittingText
                  text={nameText}
                  type="chars"
                  delay={180}
                  stagger={0.028}
                  initial={CHAR_INITIAL}
                  animate={CHAR_ANIMATE}
                  transition={CHAR_TRANSITION}
                  disableAnimation={reduced || introReduced}
                  className="text-paper"
                />
              ) : (
                <span className="invisible text-paper">{nameText}</span>
              )}
            </span>

            <span className="flex flex-wrap items-baseline gap-x-[0.28em] text-slate-blue">
              {active ? (
                <SplittingText
                  text={verbText}
                  type="chars"
                  delay={260}
                  stagger={0.028}
                  initial={CHAR_INITIAL}
                  animate={CHAR_ANIMATE}
                  transition={CHAR_TRANSITION}
                  disableAnimation={reduced || introReduced}
                  className="text-slate-blue"
                />
              ) : (
                <span className="invisible">{verbText}</span>
              )}
              <TextRotate words={rotateWords} />
            </span>
          </h1>

          <motion.p
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-electric sm:text-[11.5px]"
          >
            <span>{t("role")}</span>
            <span aria-hidden className="hidden text-dim/50 sm:inline">
              /
            </span>
            <span className="text-slate-blue">{t("stack")}</span>
          </motion.p>

          <motion.p
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            variants={reveal}
            transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
            className="mt-5 max-w-lg text-[15px] leading-[1.75] text-slate-blue md:text-[16.5px]"
          >
            {t("bio")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild variant="primary" size="lg">
              <a href="#projetos">
                {t("ctaProjects")}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={site.github} target="_blank" rel="noreferrer noopener">
                <GithubIcon className="size-4" />
                {t("ctaGithub")}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
          >
            <span>{t("location")}</span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" />
            <span>{t("years")}</span>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          variants={reveal}
          transition={{ duration: 0.75, delay: 0.28, ease: EASE }}
          className="flex justify-center lg:justify-end"
        >
          <HeroVisual driftX={ringX} driftY={ringY} />
        </motion.div>
      </div>

      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        aria-label={tA11y("heroScroll")}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-dim transition-colors hover:text-electric md:flex"
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ArrowDown className="size-3.5" strokeWidth={1.6} />
        </motion.span>
        {t("scroll")}
      </motion.a>
    </section>
  );
}

function HeroBackdrop({
  glowX,
  glowY,
}: {
  glowX: import("motion/react").MotionValue<number>;
  glowY: import("motion/react").MotionValue<number>;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
      <div className="bg-tech-grid absolute inset-0 [mask-image:radial-gradient(120%_85%_at_50%_0%,#000_20%,transparent_75%)]" />
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute -top-40 right-[-10%] size-[46rem] rounded-full bg-[radial-gradient(circle,var(--glow-navy),transparent_62%)] blur-3xl"
      />
      <div className="absolute -left-40 top-1/3 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--glow-deep),transparent_65%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
