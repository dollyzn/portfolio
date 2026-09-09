import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  id,
  children,
  className,
  label,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        "relative scroll-mt-24 px-6 py-24 sm:px-8 md:py-32 lg:px-12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "mb-14 md:mb-20",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="font-mono text-[11px] tracking-[0.28em] text-electric">
            {index}
          </span>
          <span className="h-px w-6 bg-electric/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-blue">
            {eyebrow}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-5 max-w-3xl text-[2rem] font-medium leading-[1.08] sm:text-[2.6rem] md:text-[3.25rem]">
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.12}>
          <div
            className={cn(
              "mt-5 max-w-xl text-[15px] leading-relaxed text-slate-blue md:text-base",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </div>
        </Reveal>
      ) : null}
    </header>
  );
}
