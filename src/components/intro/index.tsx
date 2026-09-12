"use client";

import { IntroProvider } from "@/components/intro/intro-context";
import { IntroBrand } from "@/components/intro/intro-brand";

export function Intro({
  children,
  skip = false,
}: {
  children: React.ReactNode;
  skip?: boolean;
}) {
  return (
    <IntroProvider skip={skip}>
      {skip ? null : <IntroBrand />}
      {children}
    </IntroProvider>
  );
}
