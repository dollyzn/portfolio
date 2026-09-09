"use client";

import { useEffect, useRef } from "react";

/**
 * Iluminação azul muito discreta seguindo o cursor. Só entra em ponteiro
 * fino e fora do prefers-reduced-motion; a posição é escrita direto no
 * style dentro de um rAF, sem re-render do React.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (!fine || reduced) return;

    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        node.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      node.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 size-[34rem] rounded-full opacity-0 mix-blend-screen transition-opacity duration-700 motion-reduce:hidden"
      style={{
        background:
          "radial-gradient(circle, rgba(37,99,235,0.075), rgba(37,99,235,0.03) 42%, transparent 68%)",
      }}
    />
  );
}
