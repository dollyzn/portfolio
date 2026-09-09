import { Intro } from "@/components/intro";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { SectionRail } from "@/components/layout/section-rail";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { ExperienceSection } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Principles } from "@/components/sections/principles";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Intro />
      <CursorGlow />
      <Navbar />
      <SectionRail />
      <main id="conteudo" className="flex-1">
        <Hero />
        <About />
        <Stack />
        <ExperienceSection />
        <Projects />
        <Principles />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
