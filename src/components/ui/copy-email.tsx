"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyEmail({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar endereço de e-mail ${email}`}
      className={cn(
        "group relative inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.015] py-2.5 pl-5 pr-3.5 transition-all duration-300 hover:border-electric/35 hover:bg-electric/[0.05]",
        className,
      )}
    >
      <span className="font-mono text-[13px] tracking-tight text-mist transition-colors group-hover:text-paper">
        {email}
      </span>

      <span className="relative grid size-7 place-items-center rounded-full bg-white/[0.04] text-slate-blue transition-colors group-hover:text-electric">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="done"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute text-cyan-bright"
            >
              <Check className="size-3.5" strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <Copy className="size-3.5" strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <AnimatePresence>
        {copied ? (
          <motion.span
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-bright/25 bg-cyan-bright/[0.08] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cyan-bright backdrop-blur-sm"
          >
            E-mail copiado
          </motion.span>
        ) : null}
      </AnimatePresence>

      <span aria-live="polite" className="sr-only">
        {copied ? "E-mail copiado para a área de transferência" : ""}
      </span>
    </button>
  );
}
