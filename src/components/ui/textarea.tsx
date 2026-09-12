import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldChrome } from "@/components/ui/input";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldChrome,
        "min-h-36 resize-y py-3 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
