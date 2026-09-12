import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, WordReveal } from "@/components/ui/reveal";
import { CopyEmail } from "@/components/ui/copy-email";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/sections/contact-form";
import { site } from "@/lib/site";

export async function Contact() {
  const t = await getTranslations("contact");
  const tMeta = await getTranslations("meta");

  return (
    <section
      id="contato"
      aria-label={t("sectionLabel")}
      className="noise-overlay relative isolate scroll-mt-24 overflow-hidden px-6 py-32 sm:px-8 md:py-44 lg:px-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-tech-grid absolute inset-0 mask-[radial-gradient(80%_70%_at_50%_60%,#000_10%,transparent_70%)]" />
        <div className="absolute -bottom-80 left-1/2 size-176 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-navy),var(--glow-deep)_46%,transparent_66%)] blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.28em] text-electric">
                07
              </span>
              <span className="h-px w-6 bg-electric/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-blue">
                {t("eyebrow")}
              </span>
            </div>
          </Reveal>

          <WordReveal
            as="h2"
            text={t("title")}
            className="mt-8 max-w-xl text-[2.3rem] font-medium leading-[1.04] tracking-[-0.035em] sm:text-[3.2rem]"
            delay={0.1}
          />

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-[16px] leading-[1.75] text-slate-blue">
              {t("body")}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-8">
              <CopyEmail email={site.email} />
            </div>
          </Reveal>

          <Reveal delay={0.34}>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={site.github} target="_blank" rel="noreferrer noopener">
                  <GithubIcon className="size-4" />
                  {t("ctaGithub")}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <LinkedinIcon className="size-4" />
                  {t("ctaLinkedin")}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              <span className="text-mist">{site.name}</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3" strokeWidth={1.7} />
                {tMeta("location")}
              </span>
            </div>
          </Reveal>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
