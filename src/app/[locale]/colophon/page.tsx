import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Colophon } from "@/components/sections/colophon";
import { routing, type AppLocale } from "@/i18n/routing";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (hasLocale(routing.locales, raw) ? raw : "pt") as AppLocale;
  const t = await getTranslations({ locale, namespace: "colophon" });
  const canonical = locale === "pt" ? `${site.url}/colophon` : `${site.url}/en/colophon`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        pt: `${site.url}/colophon`,
        en: `${site.url}/en/colophon`,
        "x-default": `${site.url}/colophon`,
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
    },
  };
}

export default async function ColophonPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <SiteChrome skipIntro>
      <Colophon />
    </SiteChrome>
  );
}
