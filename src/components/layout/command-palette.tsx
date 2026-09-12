"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Languages,
  Mail,
  Monitor,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "@wrksz/themes/client";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useIntroOptional } from "@/components/intro/intro-context";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { AppLocale } from "@/i18n/routing";
import { pageSections } from "@/lib/sections";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  group: "navigate" | "actions" | "theme" | "locale";
  label: string;
  keywords: string;
  hint?: string;
  icon: ReactNode;
  run: () => void | Promise<void>;
};

type PaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

const emptySubscribe = () => () => {};

export function useCommandPalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPalette");
  }
  return ctx;
}

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const intro = useIntroOptional();
  const ready = intro?.isComplete ?? true;

  useEffect(() => {
    if (!ready) return;

    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      <CommandPaletteDialog ready={ready} />
    </PaletteContext.Provider>
  );
}

function CommandPaletteDialog({ ready }: { ready: boolean }) {
  const { open, setOpen } = useCommandPalette();
  const t = useTranslations("command");
  const tNav = useTranslations("nav");
  const tRail = useTranslations("rail");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCopied(false);
    setActive(0);
  }, [setOpen]);

  const goSection = useCallback(
    (id: string) => {
      close();
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", `#${id === "top" ? "top" : id}`);
        return;
      }
      router.push(`/#${id}`);
    },
    [close, pathname, router],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
        close();
      }, 700);
    } catch {
      close();
    }
  }, [close]);

  const switchLocale = useCallback(
    (next: AppLocale) => {
      if (next === locale) {
        close();
        return;
      }
      const hash = window.location.hash;
      close();
      router.replace(pathname + hash, { locale: next });
    },
    [close, locale, pathname, router],
  );

  const commands = useMemo<Command[]>(() => {
    const sectionLabels: Record<(typeof pageSections)[number]["key"], string> =
      {
        home: tRail("top"),
        about: tNav("about"),
        stack: tNav("stack"),
        experience: tNav("experience"),
        projects: tNav("projects"),
        principles: tRail("principios"),
        education: tRail("formacao"),
        contact: tNav("contact"),
      };

    const navigate: Command[] = [
      ...pageSections.map((section) => ({
        id: `go-${section.id}`,
        group: "navigate" as const,
        label: sectionLabels[section.key],
        keywords: `${sectionLabels[section.key]} ${section.id} ${section.index}`,
        hint: section.index,
        icon: (
          <span className="font-mono text-[10px] text-electric">
            {section.index}
          </span>
        ),
        run: () => goSection(section.id),
      })),
      {
        id: "go-colophon",
        group: "navigate",
        label: t("colophon"),
        keywords: `colophon colofon ${t("colophon")}`,
        icon: <BookOpen className="size-4" strokeWidth={1.7} />,
        run: () => {
          close();
          if (pathname !== "/colophon") router.push("/colophon");
        },
      },
    ];

    const actions: Command[] = [
      {
        id: "copy-email",
        group: "actions",
        label: copied ? t("copied") : t("copyEmail"),
        keywords: `email mail copy ${site.email}`,
        hint: site.email,
        icon: copied ? (
          <Check className="size-4 text-cyan-bright" strokeWidth={2.2} />
        ) : (
          <Copy className="size-4" strokeWidth={1.7} />
        ),
        run: copyEmail,
      },
      {
        id: "open-github",
        group: "actions",
        label: t("openGithub"),
        keywords: "github git repo",
        icon: <GithubIcon className="size-4" />,
        run: () => {
          close();
          window.open(site.github, "_blank", "noreferrer,noopener");
        },
      },
      {
        id: "open-linkedin",
        group: "actions",
        label: t("openLinkedin"),
        keywords: "linkedin social",
        icon: <LinkedinIcon className="size-4" />,
        run: () => {
          close();
          window.open(site.linkedin, "_blank", "noreferrer,noopener");
        },
      },
      {
        id: "mailto",
        group: "actions",
        label: t("sendEmail"),
        keywords: `mailto email ${site.email}`,
        icon: <Mail className="size-4" strokeWidth={1.7} />,
        run: () => {
          close();
          window.location.href = `mailto:${site.email}`;
        },
      },
    ];

    const theme: Command[] = [
      {
        id: "theme-light",
        group: "theme",
        label: t("themeLight"),
        keywords: "theme light claro",
        icon: <Sun className="size-4" strokeWidth={1.7} />,
        run: () => {
          setTheme("light");
          close();
        },
      },
      {
        id: "theme-dark",
        group: "theme",
        label: t("themeDark"),
        keywords: "theme dark escuro",
        icon: <Moon className="size-4" strokeWidth={1.7} />,
        run: () => {
          setTheme("dark");
          close();
        },
      },
      {
        id: "theme-system",
        group: "theme",
        label: t("themeSystem"),
        keywords: "theme system sistema",
        icon: <Monitor className="size-4" strokeWidth={1.7} />,
        run: () => {
          setTheme("system");
          close();
        },
      },
    ];

    const localeCmds: Command[] = [
      {
        id: "locale-pt",
        group: "locale",
        label: t("localePt"),
        keywords: "idioma language portugues portuguese pt br",
        hint: locale === "pt" ? t("current") : undefined,
        icon: <Languages className="size-4" strokeWidth={1.7} />,
        run: () => switchLocale("pt"),
      },
      {
        id: "locale-en",
        group: "locale",
        label: t("localeEn"),
        keywords: "idioma language english ingles en",
        hint: locale === "en" ? t("current") : undefined,
        icon: <Languages className="size-4" strokeWidth={1.7} />,
        run: () => switchLocale("en"),
      },
    ];

    return [...navigate, ...actions, ...theme, ...localeCmds];
  }, [
    close,
    copied,
    copyEmail,
    goSection,
    locale,
    pathname,
    router,
    setTheme,
    switchLocale,
    t,
    tNav,
    tRail,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((item) =>
      `${item.label} ${item.keywords} ${item.hint ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const groups = useMemo(() => {
    const order = ["navigate", "actions", "theme", "locale"] as const;
    return order.flatMap((group) => {
      const items = filtered.filter((item) => item.group === group);
      if (items.length === 0) return [];
      return [{ group, items }];
    });
  }, [filtered]);

  const flat = groups.flatMap((entry) => entry.items);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      void flat[active]?.run();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  if (!ready) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette"
          role="presentation"
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label={t("close")}
            className="absolute inset-0 bg-void/72 backdrop-blur-md"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_24px_80px_-28px_color-mix(in_oklab,var(--electric)_45%,transparent)]"
            onKeyDown={onKeyDown}
          >
            <h2 id={labelId} className="sr-only">
              {t("title")}
            </h2>

            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-dim" strokeWidth={1.7} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className="h-12 w-full bg-transparent text-[15px] text-paper outline-none placeholder:text-dim"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:inline">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              role="listbox"
              aria-label={t("title")}
              className="max-h-[min(52vh,420px)] overflow-y-auto p-2"
            >
              {flat.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-dim">
                  {t("empty")}
                </p>
              ) : (
                groups.map((entry) => (
                  <div key={entry.group} className="mb-1.5">
                    <p className="px-2.5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                      {t(entry.group)}
                    </p>
                    {entry.items.map((item) => {
                      const index = flat.findIndex(
                        (candidate) => candidate.id === item.id,
                      );
                      const selected = index === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          data-index={index}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => void item.run()}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                            selected
                              ? "bg-electric/12 text-paper"
                              : "text-mist hover:bg-surface-2",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg border",
                              selected
                                ? "border-electric/25 bg-electric/10 text-electric"
                                : "border-line bg-surface text-slate-blue",
                            )}
                          >
                            {item.icon}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[14px]">
                            {item.label}
                          </span>
                          {item.hint ? (
                            <span className="hidden max-w-[40%] truncate font-mono text-[10.5px] text-dim sm:block">
                              {item.hint}
                            </span>
                          ) : null}
                          {selected ? (
                            <ArrowUpRight
                              className="size-3.5 shrink-0 text-electric"
                              strokeWidth={1.7}
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function CommandTrigger({ className }: { className?: string }) {
  const { setOpen } = useCommandPalette();
  const t = useTranslations("command");
  const intro = useIntroOptional();
  const ready = intro?.isComplete ?? true;
  const isMac = useSyncExternalStore(
    emptySubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true,
  );

  const shortcut = (
    <KbdGroup>
      <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );

  return (
    <Tooltip delay={250}>
      <TooltipTrigger
        type="button"
        onClick={() => setOpen(true)}
        disabled={!ready}
        aria-label={t("open")}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full px-3 text-slate-blue transition-colors duration-300 hover:bg-surface-2 hover:text-paper disabled:opacity-40 sm:px-3.5",
          className,
        )}
      >
        <Search className="size-[18px]" strokeWidth={1.7} />
        <span className="hidden sm:inline">{shortcut}</span>
      </TooltipTrigger>
      <TooltipPanel>
        <span className="inline-flex items-center gap-2">
          {t("open")}
          {shortcut}
        </span>
      </TooltipPanel>
    </Tooltip>
  );
}
