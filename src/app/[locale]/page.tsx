import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Intro } from "@/components/intro";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SectionRail } from "@/components/layout/section-rail";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { ExperienceSection } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Principles } from "@/components/sections/principles";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <Intro>
      <CustomCursor />
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
    </Intro>
  );
}
