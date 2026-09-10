"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useIntro } from "@/components/intro/intro-context";

type Splash = { id: number; x: number; y: number };

function subscribe(onChange: () => void) {
  const fine = window.matchMedia("(pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  fine.addEventListener("change", onChange);
  reduced.addEventListener("change", onChange);
  return () => {
    fine.removeEventListener("change", onChange);
    reduced.removeEventListener("change", onChange);
  };
}

const getSnapshot = () =>
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getServerSnapshot = () => false;

/**
 * Cursor custom: ponto + anel com lag, e splash ao clicar.
 * Só em ponteiro fino; respeita prefers-reduced-motion.
 */
export function CustomCursor() {
  const { isComplete } = useIntro();
  const pointerOk = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const enabled = pointerOk && isComplete;
  const [hovering, setHovering] = useState(false);
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let visible = false;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const interactive =
      "a, button, [role='button'], input, textarea, summary, label, .cursor-pointer";

    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.(interactive)) setHovering(true);
    };
    const onOut = (event: Event) => {
      const related = (event as MouseEvent).relatedTarget as Element | null;
      if (!related?.closest?.(interactive)) setHovering(false);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const id = ++idRef.current;
      setSplashes((prev) => [
        ...prev.slice(-4),
        { id, x: event.clientX, y: event.clientY },
      ]);
      window.setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== id));
      }, 700);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("pointerdown", onDown);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] motion-reduce:hidden"
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-electric opacity-0 will-change-transform"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border border-electric/70 opacity-0 will-change-transform transition-[width,height,border-color,background-color] duration-200 ease-out"
        style={{
          width: hovering ? 42 : 28,
          height: hovering ? 42 : 28,
          backgroundColor: hovering ? "rgba(76,177,252,0.08)" : "transparent",
        }}
      />

      <AnimatePresence>
        {splashes.map((splash) => (
          <motion.span
            key={splash.id}
            initial={{ scale: 0.2, opacity: 0.55 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-bright/80"
            style={{ left: splash.x, top: splash.y }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
