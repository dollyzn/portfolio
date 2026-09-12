"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALES: AppLocale[] = ["pt", "en"];

function BrazilMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={cn("overflow-hidden", className)}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" rx="3" fill="#009B3A" />
      <path d="M12 2.2 21.4 8 12 13.8 2.6 8Z" fill="#FEDD00" />
      <circle cx="12" cy="8" r="3.15" fill="#002776" />
      <path
        d="M9.4 7.15c1.7-.7 3.5-.55 5.2.2"
        fill="none"
        stroke="#fff"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EnglishMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" rx="3" fill="#012169" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5.2" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.4" />
    </svg>
  );
}

function FlagMark({
  locale,
  className,
}: {
  locale: AppLocale;
  className?: string;
}) {
  return locale === "pt" ? (
    <BrazilMark className={className} />
  ) : (
    <EnglishMark className={className} />
  );
}

function switchLocale(
  next: AppLocale,
  current: AppLocale,
  pathname: string,
  router: ReturnType<typeof useRouter>,
) {
  if (next === current) return;
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  router.replace(pathname + hash, { locale: next });
}

export function LocaleSwitcher({
  className,
  layoutId = "locale-pill",
}: {
  className?: string;
  layoutId?: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "pt" ? "en" : "pt";

  return (
    <div className={cn("inline-flex items-center", className)}>
      <Tooltip delay={250}>
        <TooltipTrigger
          type="button"
          onClick={() => switchLocale(next, locale, pathname, router)}
          aria-label={next === "pt" ? t("localePt") : t("localeEn")}
          className="relative inline-flex size-9 items-center justify-center rounded-full text-paper transition-colors duration-300 hover:bg-surface-2 sm:hidden"
        >
          <FlagMark
            locale={locale}
            className="h-3.5 w-[21px] rounded-[2px] shadow-sm"
          />
        </TooltipTrigger>
        <TooltipPanel>{t("locale")}</TooltipPanel>
      </Tooltip>

      <div
        role="group"
        aria-label={t("locale")}
        className="relative hidden h-10 items-center p-0.5 sm:inline-flex"
      >
        {LOCALES.map((code) => {
          const active = code === locale;
          return (
            <Tooltip key={code} delay={250}>
              <TooltipTrigger
                type="button"
                onClick={() => switchLocale(code, locale, pathname, router)}
                aria-label={code === "pt" ? t("localePt") : t("localeEn")}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                  active ? "text-paper" : "text-dim hover:text-paper",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-full bg-electric/14"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <FlagMark
                  locale={code}
                  className="relative h-3 w-[18px] rounded-[2px] shadow-sm"
                />
                <span className="relative">{code}</span>
              </TooltipTrigger>
              <TooltipPanel>
                {code === "pt" ? t("localePt") : t("localeEn")}
              </TooltipPanel>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export function LocaleSwitcherWide({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("locale")}
      className={cn(
        "grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-1",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code, locale, pathname, router)}
            aria-label={code === "pt" ? t("localePt") : t("localeEn")}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative flex items-center justify-center gap-2.5 rounded-xl px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
              active
                ? "bg-electric/12 text-paper"
                : "text-dim hover:bg-surface-2 hover:text-paper",
            )}
          >
            <FlagMark
              locale={code}
              className="h-3.5 w-[21px] rounded-[3px] shadow-sm"
            />
            {code === "pt" ? t("localePt") : t("localeEn")}
          </button>
        );
      })}
    </div>
  );
}
