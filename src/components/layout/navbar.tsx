"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const sectionIds = navLinks.map((l) => l.href.slice(1));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const active = useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
        Pular para o conteúdo
      </a>

      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled
              ? "border-b border-white/[0.06] bg-void/72 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Navegação principal"
            className={cn(
              "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 sm:px-8 lg:px-12",
              scrolled ? "h-16" : "h-20",
            )}
          >
            <a
              href="#top"
              className="rounded-lg"
              aria-label="Natã Santos - início"
            >
              <Logo />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group/nav relative block px-3.5 py-2 text-[13.5px] transition-colors duration-300",
                        isActive
                          ? "text-paper"
                          : "text-slate-blue hover:text-paper",
                      )}
                    >
                      {link.label}
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
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5">
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Perfil no GitHub (abre em nova aba)"
                className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-white/[0.04] hover:text-paper"
              >
                <GithubIcon className="size-[17px]" />
              </a>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="hidden sm:inline-flex"
              >
                <a href="#contato">
                  Fale comigo
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    strokeWidth={1.7}
                  />
                </a>
              </Button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                aria-expanded={open}
                aria-controls="menu-mobile"
                className="grid size-10 place-items-center rounded-full text-paper transition-colors hover:bg-white/[0.04] lg:hidden"
              >
                {open ? (
                  <X className="size-5" strokeWidth={1.6} />
                ) : (
                  <Menu className="size-5" strokeWidth={1.6} />
                )}
              </button>
            </div>
          </nav>

          {/* progresso de leitura */}
          <motion.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-blue-600 via-electric to-cyan-bright"
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-void/96 backdrop-blur-2xl lg:hidden"
          >
            <div
              className="bg-tech-grid absolute inset-0 opacity-40"
              aria-hidden
            />
            <nav
              aria-label="Navegação mobile"
              className="relative flex h-full flex-col justify-center px-8 pb-20"
            >
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.06 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-white/[0.05] py-4 text-3xl font-medium tracking-tight text-paper"
                    >
                      <span className="font-mono text-xs text-electric">
                        {link.index}
                      </span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex flex-col gap-3"
              >
                <Button asChild variant="primary" size="lg">
                  <a href={`mailto:${site.email}`}>Enviar e-mail</a>
                </Button>
                <p className="font-mono text-[11px] tracking-[0.18em] text-dim">
                  {site.location.toUpperCase()}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
