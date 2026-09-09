"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Superfície com um brilho azul que segue o cursor.
 * Sem estado no React: as coordenadas viram custom properties no próprio nó.
 */
export function SpotlightCard({
  children,
  className,
  radius = 340,
  intensity = 0.1,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  intensity?: number;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const node = ref.current;
    if (!node || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--sx", `${clientX - rect.left}px`);
      node.style.setProperty("--sy", `${clientY - rect.top}px`);
    });
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={handleMove}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] transition-colors duration-500 hover:border-electric/25",
        className,
      )}
      style={
        {
          "--spot-r": `${radius}px`,
          "--spot-i": intensity,
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spot-r) circle at var(--sx, 50%) var(--sy, 50%), rgba(76,177,252,var(--spot-i)), transparent 72%)",
        }}
      />
      {children}
    </Tag>
  );
}
