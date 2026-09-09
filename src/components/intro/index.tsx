"use client";

import dynamic from "next/dynamic";

// Client-only: o overlay lê sessionStorage e prefers-reduced-motion na
// primeira renderização, então não pode passar pelo SSR.
const IntroOverlay = dynamic(
  () => import("./intro-overlay").then((m) => m.IntroOverlay),
  { ssr: false },
);

export function Intro() {
  return <IntroOverlay />;
}
