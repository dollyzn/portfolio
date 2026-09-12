import * as React from "react";
import { cn } from "@/lib/utils";

const fieldChrome =
  "w-full min-w-0 rounded-2xl border border-line bg-surface px-4 text-[15px] text-paper outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-dim/80 focus-visible:border-electric/45 focus-visible:bg-electric/[0.04] focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--electric)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400/50 aria-invalid:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldChrome, "h-12", className)}
      {...props}
    />
  );
}

export { Input, fieldChrome };
