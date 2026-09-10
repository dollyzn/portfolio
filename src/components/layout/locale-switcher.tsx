"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALES: AppLocale[] = ["pt", "en"];

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: AppLocale) => {
    if (next === locale) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(pathname + hash, { locale: next });
  };

  return (
    <div
      role="group"
      aria-label={t("locale")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={code === "pt" ? t("localePt") : t("localeEn")}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors duration-300",
              active
                ? "bg-electric/15 text-electric"
                : "text-dim hover:text-paper",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
