"use client";

import type { Ref } from "react";
import {
  Turnstile as TurnstileWidget,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";
import { useLocale } from "next-intl";
import { useTheme } from "@wrksz/themes/client";
import { TURNSTILE_ACTION } from "@/lib/turnstile-action";
import { cn } from "@/lib/utils";

const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAAExogtbiA44Gx1km";

export function ContactTurnstile({
  widgetRef,
  onSuccessAction,
  className,
}: {
  widgetRef: Ref<TurnstileInstance | undefined>;
  onSuccessAction: (token: string) => void;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  return (
    <TurnstileWidget
      ref={widgetRef}
      siteKey={SITE_KEY}
      onSuccess={onSuccessAction}
      onExpire={() => onSuccessAction("")}
      onError={() => onSuccessAction("")}
      options={{
        action: TURNSTILE_ACTION,
        theme: resolvedTheme === "light" ? "light" : "dark",
        size: "flexible",
        appearance: "always",
        language: locale === "pt" ? "pt-br" : "en",
        refreshExpired: "auto",
      }}
      className={cn("min-h-16 w-full", className)}
    />
  );
}
