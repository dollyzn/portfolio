"use client";

import { useEffect, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Lock, RotateCw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";
import { cn } from "@/lib/utils";

const ROUTES = [
  { key: "home", path: "" },
  { key: "generator", path: "gerar/" },
] as const;

type RouteKey = (typeof ROUTES)[number]["key"];

function setCursorHidden(hidden: boolean) {
  if (hidden) document.documentElement.dataset.cursorHidden = "";
  else delete document.documentElement.dataset.cursorHidden;
}

export function ReciboLiveDemo({
  demo,
  trigger,
}: {
  demo: string;
  trigger: ReactElement<Record<string, unknown>>;
}) {
  const t = useTranslations("projects.recibo.live");
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState<RouteKey>("generator");
  const [reloads, setReloads] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const current = ROUTES.find((r) => r.key === route) ?? ROUTES[1];
  const src = new URL(current.path, demo).toString();
  const shownUrl = src.replace(/^https?:\/\//, "");

  useEffect(() => () => setCursorHidden(false), []);

  const navigate = (next: RouteKey) => {
    if (next === route) return;
    setLoaded(false);
    setRoute(next);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setLoaded(false);
        else setCursorHidden(false);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogPopup
        from="bottom"
        showCloseButton={false}
        className="flex h-[min(860px,calc(100dvh-1.5rem))] w-[min(1240px,calc(100vw-1.5rem))] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border-line-strong bg-panel p-0 shadow-[0_40px_120px_-30px_rgba(2,6,23,0.85)] sm:max-w-none"
      >
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>

        <div className="flex items-center gap-2 border-b border-line bg-abyss/80 px-3 py-2.5 sm:gap-3 sm:px-4">
          <div aria-hidden className="hidden items-center gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-electric/60" />
          </div>

          <div
            role="tablist"
            aria-label={t("routes")}
            className="relative flex shrink-0 rounded-full border border-line bg-surface p-0.5"
          >
            {ROUTES.map((r) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={route === r.key}
                onClick={() => navigate(r.key)}
                className={cn(
                  "relative rounded-full px-3 py-1 text-[12px] transition-colors duration-300",
                  route === r.key ? "text-paper" : "text-dim hover:text-mist",
                )}
              >
                {route === r.key ? (
                  <motion.span
                    layoutId="recibo-live-route"
                    className="absolute inset-0 rounded-full bg-electric/14"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative">{t(r.key)}</span>
              </button>
            ))}
          </div>

          <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3 font-mono text-[11.5px] text-dim">
            <Lock
              className="size-3 shrink-0 text-cyan-bright"
              strokeWidth={2.2}
            />
            <span className="truncate">{shownUrl}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoaded(false);
              setReloads((n) => n + 1);
            }}
            aria-label={t("reload")}
            className="hidden size-8 shrink-0 place-items-center rounded-full border border-line text-dim transition-colors hover:border-electric/40 hover:text-paper sm:grid"
          >
            <RotateCw className="size-3.5" strokeWidth={2} />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden h-8 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] text-mist transition-colors hover:border-electric/40 hover:text-paper md:inline-flex"
          >
            {t("newTab")}
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </a>
          <DialogClose
            aria-label={t("close")}
            className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-dim transition-colors hover:border-electric/40 hover:text-paper"
          >
            <X className="size-4" strokeWidth={2} />
          </DialogClose>
        </div>

        <div
          className="relative min-h-0 flex-1 bg-void"
          // na animação de saída o iframe passa sob o mouse parado
          onPointerEnter={() => open && setCursorHidden(true)}
          onPointerLeave={() => setCursorHidden(false)}
        >
          <iframe
            key={`${route}-${reloads}`}
            src={src}
            title={t("title")}
            onLoad={() => setLoaded(true)}
            className={cn(
              "absolute inset-0 size-full border-0 transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
          <AnimatePresence>
            {loaded ? null : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-tech-grid absolute inset-0 grid place-items-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="relative size-10">
                    <span className="absolute inset-0 rounded-full border border-line-strong" />
                    <motion.span
                      className="absolute inset-0 rounded-full border border-transparent border-t-cyan-bright"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.9,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
                    {t("loading")}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-abyss/80 px-4 py-2 font-mono text-[10.5px] text-dim">
          <span className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-bright/60" />
              <span className="relative size-1.5 rounded-full bg-cyan-bright" />
            </span>
            {t("footer")}
          </span>
          <span className="hidden sm:inline">{t("tip")}</span>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
