"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, type MotionValue } from "motion/react";
import { globeArcs, globeConfig } from "@/lib/globe-arcs";
import { markGlobeReady } from "@/lib/boot-gate";
import { cn } from "@/lib/utils";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);

function GlobeSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("grid size-full place-items-center", className)}
    >
      <div className="size-[64%] animate-pulse rounded-full border border-line bg-[radial-gradient(circle,var(--glow-navy),transparent_70%)]" />
    </div>
  );
}

export function HeroVisual({
  driftX,
  driftY,
}: {
  driftX: MotionValue<number>;
  driftY: MotionValue<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "200px" });
  const [ready, setReady] = useState(false);
  // monta imediatamente (atrás da intro) pra aquecer o WebGL
  const [mount3d] = useState(true);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-[min(88vw,340px)] sm:w-[440px] lg:w-[min(46vw,560px)]"
    >
      <motion.div
        aria-hidden
        style={{ x: driftX, y: driftY }}
        className="absolute inset-[-16%] -z-10"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,var(--glow-navy),color-mix(in_oklab,var(--navy-900)_40%,transparent)_48%,transparent_70%)] blur-2xl" />
        <div className="absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/16 blur-[80px]" />
      </motion.div>

      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        style={{ x: driftX, y: driftY }}
        className="pointer-events-none absolute inset-[-3%] size-[106%] text-electric"
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
          strokeDasharray="1 9"
        />
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="200"
            y1="4"
            x2="200"
            y2="16"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
      </motion.svg>

      <div
        role="img"
        aria-label="Globo terrestre interativo. Arraste para girar."
        data-globe
        className="relative size-full [mask-image:radial-gradient(circle_at_50%_50%,#000_74%,rgba(0,0,0,0.6)_88%,transparent_99%)] [&_canvas]:cursor-grab [&_canvas]:active:cursor-grabbing"
      >
        {mount3d ? (
          <div
            className={cn(
              "size-full transition-opacity duration-700 ease-out",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <World
              globeConfig={globeConfig}
              data={globeArcs}
              // mantém o loop rodando atrás da intro pra aquecer; pausa só fora da vista depois
              paused={!inView && ready}
              onReady={() => {
                setReady(true);
                markGlobeReady();
              }}
            />
          </div>
        ) : null}
        {!ready ? (
          <GlobeSkeleton className="pointer-events-none absolute inset-0" />
        ) : null}
      </div>

      <span className="pointer-events-none absolute -left-2 top-10 hidden font-mono text-[10px] tracking-[0.22em] text-dim/70 lg:block">
        LAT −15.79
      </span>
      <span className="pointer-events-none absolute -right-2 bottom-14 hidden font-mono text-[10px] tracking-[0.22em] text-dim/70 lg:block">
        LON −47.88
      </span>
      <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-dim/60 lg:hidden">
        arraste para girar
      </span>
      <span className="pointer-events-none absolute -bottom-1 left-1/2 hidden -translate-x-1/2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-dim/60 lg:block">
        brasília · df - arraste para girar
      </span>
    </div>
  );
}
