"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import {
  ThemeToggler,
  type ThemeSelection,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { useTheme } from "@wrksz/themes/client";
import { cn } from "@/lib/utils";

type ThemeSwitchProps = {
  className?: string;
};

const emptySubscribe = () => () => {};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const t = useTranslations("command");
  const tA11y = useTranslations("a11y");
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted || !resolvedTheme) {
    return (
      <span
        aria-hidden
        className={cn("inline-flex h-10 w-[5.25rem] rounded-full", className)}
      />
    );
  }

  return (
    <ThemeToggler
      theme={(theme as ThemeSelection) ?? "system"}
      resolvedTheme={resolvedTheme as "light" | "dark"}
      setTheme={setTheme}
      direction="tr-circle"
    >
      {({ resolved, toggleTheme }) => (
        <div
          role="group"
          aria-label={t("theme")}
          className={cn(
            "relative inline-flex h-10 items-center p-0.5",
            className,
          )}
        >
          <Tooltip delay={250}>
            <TooltipTrigger
              type="button"
              onClick={() => toggleTheme("light")}
              aria-label={tA11y("themeLight")}
              aria-current={resolved === "light" ? "true" : undefined}
              className={cn(
                "relative z-10 grid size-9 place-items-center rounded-full transition-colors duration-300",
                resolved === "light"
                  ? "text-paper"
                  : "text-dim hover:text-paper",
              )}
            >
              {resolved === "light" ? (
                <motion.span
                  layoutId="theme-pill"
                  className="absolute inset-0 rounded-full bg-electric/14"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <Sun className="relative size-3.5" strokeWidth={2.1} />
            </TooltipTrigger>
            <TooltipPanel>{t("themeLight")}</TooltipPanel>
          </Tooltip>
          <Tooltip delay={250}>
            <TooltipTrigger
              type="button"
              onClick={() => toggleTheme("dark")}
              aria-label={tA11y("themeDark")}
              aria-current={resolved === "dark" ? "true" : undefined}
              className={cn(
                "relative z-10 grid size-9 place-items-center rounded-full transition-colors duration-300",
                resolved === "dark"
                  ? "text-paper"
                  : "text-dim hover:text-paper",
              )}
            >
              {resolved === "dark" ? (
                <motion.span
                  layoutId="theme-pill"
                  className="absolute inset-0 rounded-full bg-electric/14"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <Moon className="relative size-3.5" strokeWidth={2.1} />
            </TooltipTrigger>
            <TooltipPanel>{t("themeDark")}</TooltipPanel>
          </Tooltip>
        </div>
      )}
    </ThemeToggler>
  );
}
