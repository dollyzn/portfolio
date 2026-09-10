"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TextRotate } from "@/components/ui/text-rotate";
import { HeroVisual } from "@/components/sections/hero-visual";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // posição normalizada do mouse (-0.5 → 0.5) usada pelo parallax e pelo glow
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

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      aria-label="Apresentação"
      className="noise-overlay relative isolate flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24"
    >
      <HeroBackdrop glowX={glowX} glowY={glowY} />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        {/* ── coluna de texto ───────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-4"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-bright opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-cyan-bright" />
            </span>
            <span className="text-[12.5px] tracking-tight text-mist">
              Disponível para novos desafios
            </span>
          </motion.div>

          <h1 className="mt-7 text-[2.6rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.1rem]">
            <Line delay={0.24}>
              <span className="text-[0.42em] font-normal tracking-[0.02em] text-slate-blue">
                Olá, me chamo
              </span>
            </Line>
            <Line delay={0.32}>
              <span className="text-paper">Natã.</span>
            </Line>
            <Line delay={0.4}>
              <span className="flex flex-wrap items-baseline gap-x-[0.28em] text-slate-blue">
                Eu construo
                <TextRotate
                  words={["interfaces.", "APIs.", "produtos.", "sistemas."]}
                />
              </span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-electric sm:text-[11.5px]"
          >
            <span>Desenvolvedor Full Stack</span>
            <span aria-hidden className="hidden text-dim/50 sm:inline">
              /
            </span>
            <span className="text-slate-blue">
              React · Node.js · TypeScript
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-5 max-w-lg text-[15px] leading-[1.75] text-slate-blue md:text-[16.5px]"
          >
            Construo aplicações web completas - da interface às regras de
            negócio e integrações. Gosto de código que continua fazendo sentido
            meses depois e de produtos que aguentam o mundo real, não só o happy
            path.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild variant="primary" size="lg">
              <a href="#projetos">
                Ver projetos
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={site.github} target="_blank" rel="noreferrer noopener">
                <GithubIcon className="size-4" />
                GitHub
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
          >
            <span>Brasília, DF - Brasil</span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" />
            <span>3+ anos desenvolvendo para web</span>
          </motion.div>
        </div>

        {/* ── objeto 3D ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
          className="flex justify-center lg:justify-end"
        >
          <HeroVisual driftX={ringX} driftY={ringY} />
        </motion.div>
      </div>

      {/* indicador de scroll */}
      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-label="Ir para a seção Sobre"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-dim transition-colors hover:text-electric md:flex"
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ArrowDown className="size-3.5" strokeWidth={1.6} />
        </motion.span>
        Role
      </motion.a>
    </section>
  );
}

function Line({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduced ? { opacity: 0 } : { y: "104%", opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
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
