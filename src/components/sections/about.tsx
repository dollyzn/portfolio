import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const FACT_KEYS = [
  "experience",
  "base",
  "role",
  "education",
  "languages",
] as const;

export async function About() {
  const t = await getTranslations("about");
  const curious = t.raw("curious") as string[];

  return (
    <Section id="sobre" label={t("label")}>
      <SectionHeader
        index="01"
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("titleLead")} <br className="hidden sm:block" />
            <span className="text-slate-blue">{t("titleAccent")}</span>
          </>
        }
      />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div>
          <Reveal>
            <p className="max-w-2xl text-xl font-normal leading-[1.55] tracking-[-0.015em] text-paper sm:text-[1.6rem]">
              {t("lead")}
            </p>
          </Reveal>

          <div className="mt-10 max-w-xl space-y-5 text-[15.5px] leading-[1.8] text-slate-blue">
            <Reveal delay={0.06}>
              <p>
                {t("p1Before")} <Highlight>{t("p1Highlight")}</Highlight>{" "}
                {t("p1After")}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{t("p2")}</p>
            </Reveal>
            <Reveal delay={0.14}>
              <p>{t("p3")}</p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <div className="mt-12 border-l border-electric/25 pl-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-electric">
                {t("studying")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
                {curious.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-cyan-bright/70"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ficha técnica - hairlines, sem card */}
        <Stagger className="lg:pt-2" gap={0.06}>
          <StaggerItem>
            <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
              {t("summary")}
            </p>
          </StaggerItem>
          <dl>
            {FACT_KEYS.map((key) => (
              <StaggerItem key={key}>
                <div className="group flex items-baseline justify-between gap-4 border-t border-line py-3.5 transition-colors duration-300 hover:border-electric/25">
                  <dt className="text-[13px] text-dim">
                    {t(`facts.${key}.key`)}
                  </dt>
                  <dd className="text-[13.5px] text-mist transition-colors duration-300 group-hover:text-paper">
                    {t(`facts.${key}.value`)}
                  </dd>
                </div>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </Section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-mist decoration-electric/40 underline-offset-4 [text-decoration-line:underline] [text-decoration-thickness:1px]">
      {children}
    </span>
  );
}
