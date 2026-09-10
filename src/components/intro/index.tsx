"use client";

import { IntroProvider } from "@/components/intro/intro-context";
import { IntroBrand } from "@/components/intro/intro-brand";

export function Intro({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      <IntroBrand />
      {children}
    </IntroProvider>
  );
}
