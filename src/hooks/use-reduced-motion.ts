"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Versão do useReducedMotion segura para SSR.
 *
 * O hook do motion lê a media query já na primeira renderização do cliente,
 * o que não bate com o HTML do servidor e quebra a hidratação quando a
 * preferência muda o `initial` de um componente. Com useSyncExternalStore o
 * primeiro render sempre casa com o SSR e a preferência entra logo depois.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
