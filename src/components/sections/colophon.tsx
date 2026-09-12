import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const NOTES = ["stack", "intro", "i18n", "theme", "command", "type"] as const;

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind v4",
  "Motion",
  "Three.js",
  "next-intl",
  "@wrksz/themes",
] as const;

export async function Colophon() {
  const t = await getTranslations("colophon");
  const tA11y = await getTranslations("a11y");

  return (
    <main id="conteudo" data-ready className="flex-1">
      <article
        aria-label={t("eyebrow")}
        className="relative scroll-mt-24 px-6 pb-24 pt-32 sm:px-8 md:pb-32 md:pt-40 lg:px-12"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <Link
              href="/"
              aria-label={tA11y("navHome")}
              className="group mb-12 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-blue transition-colors hover:text-paper"
            >
              <ArrowLeft
                className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
                strokeWidth={1.7}
              />
              {t("back")}
            </Link>
          </Reveal>

          <SectionHeader
            index="08"
            eyebrow={t("eyebrow")}
            title={
              <>
                {t("titleLead")}{" "}
                <span className="text-gradient-blue">{t("titleAccent")}</span>
              </>
            }
            description={t("lead")}
          />

          <Reveal delay={0.1}>
            <ul className="mb-16 flex flex-wrap gap-2">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-mist"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <ol className="grid gap-5 md:grid-cols-2">
            {NOTES.map((key, i) => (
              <Reveal key={key} delay={0.04 * i}>
                <li className="h-full rounded-2xl border border-line bg-surface p-6 md:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight text-paper">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-blue">
                    {t(`${key}.body`)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <p className="mt-16 max-w-xl font-mono text-[12px] leading-relaxed text-dim">
              {t("source", { repo: "dollyzn/portfolio" })}{" "}
              <a
                href={`${site.github}/portfolio`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-electric underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
