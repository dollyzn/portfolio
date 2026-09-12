"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CommandTrigger } from "@/components/layout/command-palette";
import {
  LocaleSwitcher,
  LocaleSwitcherWide,
} from "@/components/layout/locale-switcher";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { useIntro } from "@/components/intro/intro-context";
import { useActiveSection } from "@/hooks/use-active-section";
import { Link, usePathname } from "@/i18n/navigation";
import { hasGlobeWarmedUp } from "@/lib/boot-gate";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const sectionIds = navLinks.map((l) => l.href.slice(1));
const EASE = [0.16, 1, 0.3, 1] as const;
const LAYOUT_SPRING = { type: "spring" as const, stiffness: 200, damping: 30 };

const navItemVariants = {
  hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Navbar() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const tMeta = useTranslations("meta");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const active = useActiveSection(sectionIds);
  const pathname = usePathname();
  const atHome = pathname === "/";
  const { phase, setPhase, isRevealing, reduced } = useIntro();

  const brandOnStage =
    phase === "drawing" || (phase === "booting" && !hasGlobeWarmedUp());
  const logoInHeader = !brandOnStage;
  const chromeVisible = isRevealing || reduced;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (!open) {
      html.style.overflow = "";
      body.style.overflow = "";
      return;
    }
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-void"
      >
        {tA11y("skip")}
      </a>

      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        <div
          className={cn(
            "relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled || open
              ? "border-b border-line bg-void/72 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label={tA11y("navMain")}
            className={cn(
              "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 sm:px-8 lg:px-12",
              scrolled ? "h-16" : "h-20",
            )}
          >
            <Link
              href={atHome ? "/#top" : "/"}
              className="group/logo relative z-[70] inline-flex items-center gap-2.5 rounded-lg"
              aria-label={tA11y("navHome")}
            >
              <span className="relative block size-7">
                {logoInHeader ? (
                  <motion.span
                    layoutId="brand-logo"
                    transition={LAYOUT_SPRING}
                    onLayoutAnimationComplete={() => {
                      if (phase === "moving") setPhase("revealing");
                    }}
                    className="absolute inset-0 block text-paper"
                  >
                    <LogoMark className="drop-shadow-[0_0_10px_color-mix(in_oklab,var(--electric)_30%,transparent)] transition-[filter] duration-500 group-hover/logo:drop-shadow-[0_0_16px_color-mix(in_oklab,var(--cyan-bright)_55%,transparent)]" />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 opacity-0 blur-lg transition-opacity duration-500 group-hover/logo:opacity-100"
                    />
                  </motion.span>
                ) : null}
              </span>

              <motion.span
                initial={false}
                animate={
                  chromeVisible
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: -8, filter: "blur(4px)" }
                }
                transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                className="text-[15px] font-medium tracking-[-0.02em] text-paper"
              >
                {t("brand")}
                <span className="text-electric">.</span>
              </motion.span>
            </Link>

            <motion.ul
              initial="hidden"
              animate={chromeVisible ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.08 },
                },
              }}
              className="hidden items-center gap-1 lg:flex"
            >
              {navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <motion.li
                    key={link.href}
                    variants={navItemVariants}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <Link
                      href={`/${link.href}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group/nav relative block px-3.5 py-2 text-[13.5px] transition-colors duration-300",
                        isActive
                          ? "text-paper"
                          : "text-slate-blue hover:text-paper",
                      )}
                    >
                      {t(link.key)}
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-electric to-cyan-bright transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/nav:scale-x-100"
                      />
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden
                          className="absolute inset-x-3.5 bottom-1 h-px bg-electric"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 34,
                          }}
                        />
                      ) : null}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              initial="hidden"
              animate={chromeVisible ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.18 },
                },
              }}
              className="flex items-center gap-2"
            >
              <motion.div
                variants={navItemVariants}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center rounded-full border border-line bg-surface/80 p-0.5"
              >
                <LocaleSwitcher layoutId="locale-pill-nav" />
                <span aria-hidden className="mx-0.5 h-4 w-px bg-line" />
                <ThemeSwitch />
                <span aria-hidden className="mx-0.5 h-4 w-px bg-line" />
                <CommandTrigger />
              </motion.div>

              <motion.div
                variants={navItemVariants}
                transition={{ duration: 0.4, ease: EASE }}
                className="hidden sm:block"
              >
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-11 px-5"
                >
                  <Link href="/#contato">
                    {t("cta")}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      strokeWidth={1.7}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.button
                variants={navItemVariants}
                transition={{ duration: 0.4, ease: EASE }}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? tA11y("menuClose") : tA11y("menuOpen")}
                aria-expanded={open}
                aria-controls="menu-mobile"
                className="grid size-10 place-items-center rounded-full text-paper transition-colors hover:bg-surface-2 lg:hidden"
              >
                <MenuToggle open={open} />
              </motion.button>
            </motion.div>
          </nav>

          <motion.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-blue-600 via-electric to-cyan-bright"
          />
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-void/96 backdrop-blur-2xl lg:hidden"
          >
            <div
              className="bg-tech-grid pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
            />
            <nav
              aria-label={tA11y("navMobile")}
              className="relative mx-auto flex min-h-full w-full max-w-lg flex-col px-6 pt-[calc(env(safe-area-inset-top,0px)+6.25rem)] pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)] sm:px-8"
            >
              <ul className="flex-1 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.06 + i * 0.06,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={`/${link.href}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-3.5 border-b border-line py-3.5 text-[1.85rem] font-medium leading-tight tracking-tight text-paper sm:gap-4 sm:py-4 sm:text-3xl"
                    >
                      <span className="font-mono text-xs text-electric">
                        {link.index}
                      </span>
                      {t(link.key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex shrink-0 flex-col gap-3 sm:mt-8"
              >
                <LocaleSwitcherWide />
                <Link
                  href="/colophon"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-line px-4 py-3 text-center text-sm text-mist transition-colors hover:border-electric/35 hover:text-paper"
                >
                  {t("colophon")}
                </Link>
                <ShimmerButton
                  href={`mailto:${site.email}`}
                  onClick={() => setOpen(false)}
                  background="var(--paper)"
                  shimmerColor="var(--shimmer-on-cta)"
                  shimmerSize="0.14em"
                  shimmerDuration="2.4s"
                  className="h-12 w-full border-transparent text-[15px] font-medium text-void"
                >
                  {t("mobileEmail")}
                </ShimmerButton>
                <p className="pt-1 font-mono text-[11px] tracking-[0.18em] text-dim">
                  {tMeta("location").toUpperCase()}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
