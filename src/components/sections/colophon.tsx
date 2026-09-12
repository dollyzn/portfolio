import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ColophonCode } from "@/components/sections/colophon-code";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const NOTES = ["stack", "intro", "i18n", "theme", "command", "type"] as const;

const STACK = [
  { name: "Next.js 16", hint: "App Router" },
  { name: "React 19", hint: "RSC" },
  { name: "TypeScript", hint: "strict" },
  { name: "Tailwind v4", hint: "tokens" },
  { name: "Motion", hint: "layoutId" },
  { name: "Three.js", hint: "WebGL" },
  { name: "next-intl", hint: "pt / en" },
  { name: "@wrksz/themes", hint: "no flash" },
] as const;

export async function Colophon() {
  const t = await getTranslations("colophon");
  const tA11y = await getTranslations("a11y");

  return (
    <main id="conteudo" data-ready className="flex-1">
      <article
        aria-label={t("eyebrow")}
        className="relative overflow-hidden px-6 pb-24 pt-32 sm:px-8 md:pb-32 md:pt-40 lg:px-12"
      >
        <div
          aria-hidden
          className="bg-tech-grid pointer-events-none absolute inset-0 opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,var(--glow-navy),transparent_68%)] blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl">
          <Reveal>
            <Link
              href="/"
              aria-label={tA11y("navHome")}
              className="group mb-14 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-blue transition-colors hover:text-paper"
            >
              <ArrowLeft
                className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
                strokeWidth={1.7}
              />
              {t("back")}
            </Link>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-electric">
                08 — {t("eyebrow")}
              </p>
              <h1 className="mt-4 max-w-xl text-[2.6rem] font-medium leading-[1.05] tracking-[-0.04em] text-paper sm:text-[3.4rem]">
                {t("titleLead")}{" "}
                <span className="text-gradient-blue">{t("titleAccent")}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-md text-[16px] leading-relaxed text-slate-blue lg:justify-self-end">
                {t("lead")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="mt-16">
              <ColophonCode caption={t("snippetCaption")} />
            </div>
          </Reveal>

          <section className="mt-20">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                {t("stackLabel")}
              </p>
            </Reveal>
            <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {STACK.map((item, i) => (
                <li key={item.name} className="bg-panel">
                  <Reveal delay={0.03 * i} className="p-4 sm:p-5">
                    <p className="font-mono text-[10px] text-electric">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-[14.5px] text-paper">{item.name}</p>
                    <p className="mt-1 font-mono text-[11px] text-dim">
                      {item.hint}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <ol className="mt-20 space-y-0 border-t border-line">
            {NOTES.map((key, i) => (
              <li key={key} className="border-b border-line">
                <Reveal
                  delay={0.03 * i}
                  className="grid gap-4 py-8 sm:grid-cols-[4.5rem_minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-8 sm:py-10"
                >
                  <p className="font-mono text-[13px] text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-[1.35rem] font-medium tracking-tight text-paper sm:text-[1.5rem]">
                    {t(`${key}.title`)}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-slate-blue">
                    {t(`${key}.body`)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.16}>
            <p className="mt-16 flex flex-wrap items-center gap-2 font-mono text-[12px] text-dim">
              {t("source", { repo: "dollyzn/portfolio" })}
              <a
                href={`${site.github}/portfolio`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-electric underline-offset-4 hover:underline"
              >
                GitHub
                <ArrowUpRight className="size-3" strokeWidth={1.8} />
              </a>
            </p>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
