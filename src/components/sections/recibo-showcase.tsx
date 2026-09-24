"use client";

import {
  ArrowUpRight,
  FileCheck2,
  LayoutTemplate,
  PenLine,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "@wrksz/themes/client";
import type { LucideIcon } from "lucide-react";
import {
  PreviewLinkCard,
  PreviewLinkCardImage,
  PreviewLinkCardPanel,
  PreviewLinkCardTrigger,
} from "@/components/animate-ui/components/base/preview-link-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { RepoPreview } from "@/components/sections/repo-preview";
import { ReciboLiveDemo } from "@/components/sections/recibo-live-demo";
import { ReciboStage } from "@/components/sections/recibo-stage";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/content";

const SHOTS = "/projects/recibo-livre";

type Screen = {
  key: "screenLanding" | "screenGenerator" | "screenReceipt";
  route: string;
  path: string;
  icon: LucideIcon;
  src: (mode: "light" | "dark") => string;
  width: number;
  height: number;
};

const SCREENS: Screen[] = [
  {
    key: "screenLanding",
    route: "/",
    path: "",
    icon: LayoutTemplate,
    src: (mode) => `${SHOTS}/landing-${mode}.webp`,
    width: 320,
    height: 200,
  },
  {
    key: "screenGenerator",
    route: "/gerar",
    path: "gerar/",
    icon: PenLine,
    src: (mode) => `${SHOTS}/gerar-${mode}.webp`,
    width: 320,
    height: 200,
  },
  {
    key: "screenReceipt",
    route: "recibo-0042.pdf",
    path: "gerar/",
    icon: FileCheck2,
    src: () => `${SHOTS}/recibo.webp`,
    width: 180,
    height: 254,
  },
];

export function ReciboFeatured({ project: p }: { project: Project }) {
  const t = useTranslations("projects");
  const tr = useTranslations("projects.recibo");
  const reduced = useReducedMotion();

  const stats = [
    { value: "0", label: tr("stats.uploads") },
    { value: "3", label: tr("stats.steps") },
    { value: "A4", label: tr("stats.format") },
  ];

  return (
    <Reveal>
      <motion.div
        whileHover={reduced ? undefined : { y: -4 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SpotlightCard
          as="article"
          radius={520}
          intensity={0.09}
          className="relative grid overflow-hidden rounded-3xl lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="order-2 flex flex-col justify-center p-7 sm:p-10 lg:order-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-bright/25 bg-cyan-bright/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-bright">
                {t("featured")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-electric/60" />
                  <span className="relative size-1.5 rounded-full bg-electric" />
                </span>
                {tr("badge")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                {p.kind}
              </span>
            </div>

            <h3 className="mt-5 text-[2.1rem] font-medium leading-none tracking-[-0.03em] text-paper sm:text-[2.6rem]">
              {p.name}
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-mist">
              {p.tagline}
            </p>
            <p className="mt-4 max-w-lg text-[14.5px] leading-[1.75] text-slate-blue">
              {p.description}
            </p>

            <dl className="mt-7 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface">
              {stats.map((stat) => (
                <div key={stat.label} className="px-3.5 py-3">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-gradient-accent text-[1.6rem] font-medium leading-none tracking-[-0.03em]">
                    {stat.value}
                  </dd>
                  <dd className="mt-1.5 text-[11.5px] leading-snug text-dim">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-[13px] text-slate-blue"
                >
                  <span
                    aria-hidden
                    className="size-1 shrink-0 rounded-full bg-electric/70"
                  />
                  {f}
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded border border-line bg-surface px-2 py-1 font-mono text-[10.5px] tracking-tight text-dim"
                >
                  {s}
                </li>
              ))}
            </ul>

            <Screens project={p} />

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
              {p.demo ? (
                <>
                  <ReciboLiveDemo
                    demo={p.demo}
                    trigger={
                      <ShimmerButton
                        background="var(--paper)"
                        shimmerColor="var(--shimmer-on-cta)"
                        shimmerSize="0.12em"
                        shimmerDuration="2.6s"
                        className="h-10 gap-2 border-transparent px-4 text-[13.5px] font-medium text-void"
                      >
                        <Play
                          className="size-3.5 fill-current"
                          strokeWidth={0}
                        />
                        {tr("live.trigger")}
                      </ShimmerButton>
                    }
                  />
                  <ScreenLink
                    screen={SCREENS[0]}
                    href={p.demo}
                    className="group/link inline-flex items-center gap-2 text-[13.5px] text-mist transition-colors duration-300 hover:text-paper"
                  >
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-cyan-bright/60" />
                      <span className="relative size-1.5 rounded-full bg-cyan-bright" />
                    </span>
                    <span className="relative">
                      {tr("open")}
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-electric transition-transform duration-400 ease-out-expo group-hover/link:scale-x-100"
                      />
                    </span>
                    <ArrowUpRight
                      className="-ml-1 size-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </ScreenLink>
                </>
              ) : (
                <span className="text-[13px] text-dim" title={t("soonTitle")}>
                  {t("soon")}
                </span>
              )}
              <RepoPreview href={p.repo} label={t("code")} name={p.name} />
            </div>
          </div>

          <div className="relative order-1 overflow-hidden border-b border-line bg-[radial-gradient(120%_100%_at_50%_0%,var(--navy-950)_0%,var(--abyss)_55%,var(--void)_100%)] px-3 pb-4 pt-3 sm:px-5 sm:pb-5 lg:order-2 lg:border-b-0 lg:border-l">
            <div
              aria-hidden
              className="bg-tech-grid absolute inset-0 opacity-40 dark:opacity-[0.55]"
            />
            <div
              aria-hidden
              className="absolute -right-24 -top-24 size-72 rounded-full bg-electric/12 blur-[80px]"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 left-10 size-64 rounded-full bg-cyan-bright/[0.07] blur-[80px]"
            />
            <ReciboStage className="relative h-full justify-center" />
          </div>

          {/* o `order` da coluna do palco também muda a ordem de pintura no grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          >
            <BorderBeam
              size={90}
              duration={9}
              borderWidth={1.2}
              colorFrom="var(--electric)"
              colorTo="var(--cyan-bright)"
            />
          </div>
        </SpotlightCard>
      </motion.div>
    </Reveal>
  );
}

function Screens({ project: p }: { project: Project }) {
  const tr = useTranslations("projects.recibo");

  return (
    <div className="mt-6">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        {tr("screens")}
        <span aria-hidden className="h-px w-5 bg-line-strong" />
        <span className="normal-case tracking-normal">{tr("screensHint")}</span>
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {SCREENS.map((screen) => (
          <ScreenLink
            key={screen.key}
            screen={screen}
            href={p.demo ? new URL(screen.path, p.demo).toString() : p.repo}
            className="group/chip inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-mist transition-colors duration-300 hover:border-electric/35 hover:bg-electric/[0.06] hover:text-paper"
          >
            <screen.icon
              className="size-3.5 text-dim transition-colors group-hover/chip:text-cyan-bright"
              strokeWidth={1.8}
            />
            {tr(screen.key)}
          </ScreenLink>
        ))}
      </div>
    </div>
  );
}

function ScreenLink({
  screen,
  href,
  className,
  children,
}: {
  screen: Screen;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const tr = useTranslations("projects.recibo");
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "light" ? "light" : "dark";
  const host = href.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <PreviewLinkCard
      href={href}
      src={screen.src(mode)}
      width={screen.width}
      height={screen.height}
      followCursor="x"
    >
      <PreviewLinkCardTrigger
        delay={120}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {children}
      </PreviewLinkCardTrigger>
      <PreviewLinkCardPanel
        side="top"
        sideOffset={14}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-xl border-line-strong bg-panel p-1.5 shadow-[0_24px_60px_-24px_rgba(2,6,23,0.7)]"
      >
        <PreviewLinkCardImage
          alt={tr(screen.key)}
          className="mx-auto block rounded-lg object-cover object-top"
          style={{ width: screen.width, height: screen.height }}
        />
        <span className="flex items-center justify-between gap-3 px-1.5 pb-0.5 pt-2">
          <span className="font-mono text-[10.5px] text-paper">
            {screen.route}
          </span>
          <span className="flex items-center gap-1 truncate font-mono text-[9.5px] text-dim">
            {host.includes("github.com") ? tr("previewOn") : host}
            <ArrowUpRight className="size-3" strokeWidth={2} />
          </span>
        </span>
      </PreviewLinkCardPanel>
    </PreviewLinkCard>
  );
}
