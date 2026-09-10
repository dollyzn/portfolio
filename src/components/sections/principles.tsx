import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { getContent } from "@/content";
import type { AppLocale } from "@/i18n/routing";

export async function Principles() {
  const t = await getTranslations("principles");
  const locale = (await getLocale()) as AppLocale;
  const { principles } = getContent(locale);

  return (
    <section
      id="principios"
      aria-label={t("sectionLabel")}
      className="relative scroll-mt-24 overflow-hidden px-6 py-28 sm:px-8 md:py-40 lg:px-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/25 to-transparent dark:via-white/[0.08]" />
        <div className="absolute left-1/2 top-0 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-navy),transparent_66%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric/25 to-transparent dark:via-white/[0.08]" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.28em] text-electric">
              05
            </span>
            <span className="h-px w-6 bg-electric/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-blue">
              {t("eyebrow")}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-3xl text-[2.4rem] font-medium leading-[1.03] tracking-[-0.035em] sm:text-[3.4rem] md:text-[4.2rem]">
            {t("titleLead")}
            <br />
            <span className="text-gradient-blue">{t("titleAccent")}</span>
          </h2>
        </Reveal>

        <ol className="mt-20 md:mt-28">
          {principles.map((p, i) => (
            <li key={p.index}>
              <Reveal delay={i * 0.08}>
                <div className="group grid gap-5 border-t border-line py-10 transition-colors duration-500 hover:border-electric/25 md:grid-cols-[7rem_1fr] md:gap-10 md:py-14">
                  <span className="font-mono text-[2.5rem] leading-none text-dim/35 transition-colors duration-500 group-hover:text-electric/45 md:text-[3.5rem]">
                    {p.index}
                  </span>
                  <div className="max-w-3xl">
                    <h3 className="text-[1.5rem] font-medium leading-[1.25] tracking-[-0.025em] text-paper md:text-[2rem]">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-slate-blue">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
