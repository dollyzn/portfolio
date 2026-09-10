"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { LogoMark } from "@/components/ui/logo";
import { whenGlobeReady } from "@/lib/boot-gate";

const EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_MS = 700;
const SEEN_KEY = "ns-intro-seen";
/** Se o globo demorar demais, a intro não trava pra sempre. */
const GLOBE_WAIT_CAP_MS = 10000;

/** Primeira visita: ~2.2s. F5 / retornos: ~0.9s. Só conta DEPOIS do globo. */
function getDurationMs() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1" ? 900 : 2200;
  } catch {
    return 2200;
  }
}

function shouldPlay() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IntroOverlay() {
  const [visible, setVisible] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);
  const [duration] = useState(getDurationMs);
  const [progress, setProgress] = useState(0);
  const [globeReady, setGlobeReady] = useState(false);
  const [filling, setFilling] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);
  const progressMv = useMotionValue(0);

  const finish = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    setProgress(100);

    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* modo privado */
    }

    window.setTimeout(() => setVisible(false), EXIT_MS);
  }, []);

  useEffect(() => {
    if (!visible) document.documentElement.dataset.intro = "done";
  }, [visible]);

  // espera o globo (ou o teto de tempo) antes de começar o 0→100
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const cap = window.setTimeout(() => {
      if (!cancelled) setGlobeReady(true);
    }, GLOBE_WAIT_CAP_MS);

    const unsub = whenGlobeReady(() => {
      if (!cancelled) setGlobeReady(true);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      unsub();
    };
  }, [visible]);

  // só então anima o progresso e agenda a saída
  useEffect(() => {
    if (!visible || !globeReady || leavingRef.current) return;

    setFilling(true);
    const controls = animate(progressMv, 100, {
      duration: duration / 1000,
      ease: "linear",
      onUpdate: (v) => setProgress(Math.round(v)),
    });

    const auto = window.setTimeout(finish, duration);

    return () => {
      controls.stop();
      window.clearTimeout(auto);
    };
  }, [visible, globeReady, duration, progressMv, finish]);

  useEffect(() => {
    if (!visible) return;
    const targets = [
      document.getElementById("conteudo"),
      ...document.querySelectorAll<HTMLElement>(
        "body > header, body > footer, body > nav",
      ),
    ].filter((el): el is HTMLElement => Boolean(el));

    targets.forEach((el) => el.setAttribute("inert", ""));
    dialogRef.current?.focus({ preventScroll: true });

    return () => targets.forEach((el) => el.removeAttribute("inert"));
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        finish();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, finish]);

  if (!visible) return null;

  const statusLabel = filling
    ? "carregando experiência"
    : "preparando experiência";

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label="Introdução do portfólio"
      initial={{ opacity: 1 }}
      animate={
        leaving
          ? { opacity: 0, filter: "blur(8px)" }
          : { opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: EXIT_MS / 1000, ease: EASE }}
      className="fixed inset-0 z-[100] overflow-hidden bg-void outline-none"
    >
      <div
        aria-hidden
        className="bg-tech-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(70%_55%_at_50%_48%,#000,transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[28rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-navy),transparent_68%)] blur-3xl"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="relative grid place-items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative h-[4.75rem] sm:h-[5.5rem]"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-2xl"
            />
            <LogoMark
              priority
              className="drop-shadow-[0_0_22px_rgba(76,177,252,0.35)]"
            />
          </motion.div>
        </div>

        <div className="mt-9 flex h-[3.25rem] flex-col items-center justify-start">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
            className="text-[13px] font-medium tracking-[0.34em] text-paper sm:text-sm"
          >
            NATÃ
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.42, ease: EASE }}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-dim"
          >
            desenvolvedor full stack
          </motion.p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-7 sm:px-10 sm:pb-9">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-dim sm:text-[11px]"
        >
          {statusLabel}
          <span className="ml-1 inline-block animate-pulse text-electric">
            _
          </span>
        </motion.p>

        <motion.p
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-5xl font-medium tabular-nums tracking-tight text-paper/90 sm:text-6xl md:text-7xl"
        >
          {String(progress).padStart(2, "0")}
          <span className="text-electric">%</span>
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.05, ease: "linear" }}
          className="h-px origin-left bg-gradient-to-r from-blue-600 via-electric to-cyan-bright"
        />
      </div>

      <button
        type="button"
        onClick={finish}
        aria-label="Entrar no portfólio"
        className="absolute inset-0 z-10 cursor-none outline-offset-[-6px]"
      />
    </motion.div>
  );
}

export default IntroOverlay;
