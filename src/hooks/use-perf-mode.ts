"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  getPerfSnapshot,
  getServerPerfSnapshot,
  subscribePerf,
  type PerfSnapshot,
} from "@/lib/perf-mode";

/**
 * Estado do modo de desempenho. No primeiro render (server e cliente) vem
 * sempre "full"/resolved: false - a sondagem entra logo depois, sem quebrar
 * a hidratação.
 */
export function usePerfMode(): PerfSnapshot {
  return useSyncExternalStore(
    subscribePerf,
    getPerfSnapshot,
    getServerPerfSnapshot,
  );
}

/** Atalho para os componentes que só querem saber se é para aliviar. */
export function useLiteMode() {
  return usePerfMode().mode === "lite";
}

/**
 * Animação simplificada: ou o usuário pediu menos movimento, ou o modo leve
 * entrou em cena. Os dois casos caem no mesmo estado estático dos componentes.
 */
export function useSimplifiedMotion() {
  const reduced = useReducedMotion();
  const lite = useLiteMode();
  return reduced || lite;
}
