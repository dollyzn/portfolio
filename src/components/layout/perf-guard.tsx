"use client";

import { useEffect, useLayoutEffect } from "react";
import { useIntroOptional } from "@/components/intro/intro-context";
import { PerfNotice } from "@/components/layout/perf-notice";
import { usePerfMode } from "@/hooks/use-perf-mode";
import { initPerfMode, reportSlowRuntime } from "@/lib/perf-mode";

/** Janelas de 1s abaixo disso, seguidas, contam como travamento real. */
const MIN_FPS = 24;
const SLOW_WINDOWS = 2;
const SAMPLE_WINDOWS = 6;

/**
 * Resolve o modo de desempenho antes da primeira pintura e, depois da intro,
 * mede alguns segundos de FPS - a sondagem de WebGL não pega lentidão de CPU
 * nem navegador que esconde a string do driver.
 */
export function PerfGuard() {
  const { mode, preference, resolved } = usePerfMode();
  const intro = useIntroOptional();
  const ready = intro?.isComplete ?? true;

  useLayoutEffect(() => {
    initPerfMode();
  }, []);

  useEffect(() => {
    if (!resolved || !ready || mode === "lite" || preference !== "auto") return;

    let raf = 0;
    let frames = 0;
    let slow = 0;
    let windows = 0;
    let start = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      frames += 1;

      const elapsed = now - start;
      if (elapsed < 1000) return;

      const fps = (frames * 1000) / elapsed;
      frames = 0;
      start = now;
      windows += 1;
      slow =
        document.visibilityState === "visible" && fps < MIN_FPS ? slow + 1 : 0;

      if (slow >= SLOW_WINDOWS) {
        cancelAnimationFrame(raf);
        reportSlowRuntime();
        return;
      }
      if (windows >= SAMPLE_WINDOWS) cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resolved, ready, mode, preference]);

  return <PerfNotice ready={ready} />;
}
