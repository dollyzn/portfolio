import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-slate-blue",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
