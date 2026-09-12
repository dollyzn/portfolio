import { getTranslations } from "next-intl/server";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tA11y = await getTranslations("a11y");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[15px] font-medium text-paper">{site.name}</p>
          <p className="mt-1 text-[13.5px] text-slate-blue">{t("role")}</p>
          <p className="mt-5 max-w-xs font-mono text-[11px] leading-relaxed text-dim">
            {t("blurb")}
          </p>
          <Link
            href="/colophon"
            className="mt-4 inline-flex font-mono text-[11px] uppercase tracking-[0.18em] text-slate-blue transition-colors hover:text-electric"
          >
            {t("colophon")}
          </Link>
        </div>

        <div className="flex flex-col gap-5 sm:items-end">
          <div className="flex items-center gap-1">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={tA11y("footerGithub")}
              className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-surface-2 hover:text-paper"
            >
              <GithubIcon className="size-[17px]" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={tA11y("footerLinkedin")}
              className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-surface-2 hover:text-paper"
            >
              <LinkedinIcon className="size-[17px]" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label={tA11y("footerEmail", { email: site.email })}
              className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-surface-2 hover:text-paper"
            >
              <Mail className="size-[18px]" strokeWidth={1.6} />
            </a>
            <Link
              href="/#top"
              aria-label={tA11y("footerTop")}
              className="group ml-1 grid size-10 place-items-center rounded-full border border-line-strong text-slate-blue transition-colors duration-300 hover:border-electric/35 hover:text-electric"
            >
              <ArrowUp
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={1.7}
              />
            </Link>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
