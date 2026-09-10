"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/animate-ui/components/base/switch";
import {
  ThemeToggler,
  type ThemeSelection,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { cn } from "@/lib/utils";

type ThemeSwitchProps = {
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-5 w-8 shrink-0 rounded-full border border-line bg-surface",
          className,
        )}
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
        <Switch
          checked={resolved === "dark"}
          onCheckedChange={(checked) => {
            toggleTheme(checked ? "dark" : "light");
          }}
          aria-label={
            resolved === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
          }
          startIcon={<Sun strokeWidth={2.2} />}
          endIcon={<Moon strokeWidth={2.2} />}
          className={cn(
            "h-5 w-9 border-line shadow-none",
            "data-[checked]:bg-electric data-[unchecked]:bg-input",
            "dark:data-[unchecked]:bg-input",
            className,
          )}
        />
      )}
    </ThemeToggler>
  );
}
