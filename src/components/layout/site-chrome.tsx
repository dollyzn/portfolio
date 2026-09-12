import type { ReactNode } from "react";
import { Intro } from "@/components/intro";
import { CommandPalette } from "@/components/layout/command-palette";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionRail } from "@/components/layout/section-rail";

export function SiteChrome({
  children,
  skipIntro = false,
  showRail = false,
}: {
  children: ReactNode;
  skipIntro?: boolean;
  showRail?: boolean;
}) {
  return (
    <Intro skip={skipIntro}>
      <CommandPalette>
        <CustomCursor />
        <Navbar />
        {showRail ? <SectionRail /> : null}
        {children}
        <Footer />
      </CommandPalette>
    </Intro>
  );
}
