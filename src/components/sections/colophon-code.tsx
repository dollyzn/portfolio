"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SNIPPET = [
  { type: "comment", text: "// a intro só desenha depois do WebGL aquecer" },
  { type: "code", text: "const cap = setTimeout(unlock, 10_000)" },
  { type: "code", text: "whenGlobeReady(unlock)" },
  { type: "blank", text: "" },
  {
    type: "comment",
    text: "// se o globo travasse no meio do draw, você ia notar",
  },
  { type: "code", text: 'if (ready) setPhase("drawing")' },
] as const;

export function ColophonCode({ caption }: { caption: string }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced ? SNIPPET.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (visible >= SNIPPET.length) return;
    const id = window.setTimeout(() => setVisible((n) => n + 1), 220);
    return () => window.clearTimeout(id);
  }, [reduced, visible]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span aria-hidden className="size-2 rounded-full bg-line-strong" />
        <span aria-hidden className="size-2 rounded-full bg-line-strong" />
        <span aria-hidden className="size-2 rounded-full bg-line-strong" />
        <figcaption className="ml-2 font-mono text-[11px] tracking-[0.14em] text-dim">
          boot-gate.ts
        </figcaption>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 sm:text-[13.5px]">
        {SNIPPET.map((line, i) => (
          <span
            key={`${line.text}-${i}`}
            className={cn(
              "block transition-opacity duration-500",
              i < visible ? "opacity-100" : "opacity-0",
              line.type === "comment" && "text-dim",
              line.type === "code" && "text-mist",
              line.type === "blank" && "h-4",
            )}
          >
            {line.type === "blank" ? (
              "\n"
            ) : (
              <>
                <span className="mr-4 inline-block w-4 text-right text-dim/70">
                  {i + 1}
                </span>
                {line.text}
              </>
            )}
          </span>
        ))}
      </pre>
      <p className="border-t border-line px-5 py-3 text-[13px] text-slate-blue">
        {caption}
      </p>
    </figure>
  );
}
