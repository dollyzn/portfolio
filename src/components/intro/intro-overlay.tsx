"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { LogoMark } from "@/components/ui/logo";
import { preloadGlobe } from "@/lib/preload-globe";

const EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_MS = 850;
const AUTO_ENTER_MS = 2600;

function shouldPlay() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  try {
    return sessionStorage.getItem("ns-intro") !== "1";
  } catch {
    return true;
  }
}

export function IntroOverlay() {
  const [visible, setVisible] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);

  const finish = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);

    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem("ns-intro", "1");
    } catch {
      /* modo privado: só não memoriza */
    }

    window.setTimeout(() => setVisible(false), EXIT_MS);
  }, []);

  useEffect(() => {
    if (!visible) document.documentElement.dataset.intro = "done";
  }, [visible]);

  useEffect(() => {
    preloadGlobe();
  }, []);

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
    const auto = window.setTimeout(finish, AUTO_ENTER_MS);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(auto);
    };
  }, [visible, finish]);

  if (!visible) return null;

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
        className="absolute left-1/2 top-1/2 size-[28rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,30,109,0.55),transparent_68%)] blur-3xl"
      />

      <button
        type="button"
        onClick={finish}
        className="absolute right-6 top-6 z-20 rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-dim transition-colors duration-300 hover:text-electric sm:right-8 sm:top-8"
      >
        pular
      </button>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="relative grid place-items-center">
          <motion.svg
            aria-hidden
            viewBox="0 0 120 120"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute size-[11.5rem] text-electric/70 sm:size-[13rem]"
          >
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="327"
              initial={{ strokeDashoffset: 327 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.35, delay: 0.25, ease: EASE }}
            />
          </motion.svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative h-[4.75rem] sm:h-[5.5rem]"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-2xl"
            />
            <LogoMark priority className="drop-shadow-[0_0_22px_rgba(76,177,252,0.35)]" />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="mt-9 text-[13px] font-medium tracking-[0.34em] text-paper sm:text-sm"
        >
          NATÃ SANTOS
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-dim"
        >
          desenvolvedor full stack
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTO_ENTER_MS / 1000, ease: "linear" }}
          className="h-px origin-left bg-gradient-to-r from-blue-600 via-electric to-cyan-bright"
        />
      </div>

      <button
        type="button"
        onClick={finish}
        aria-label="Entrar no portfólio"
        className="absolute inset-0 z-10 cursor-pointer outline-offset-[-6px]"
      />
    </motion.div>
  );
}

export default IntroOverlay;
