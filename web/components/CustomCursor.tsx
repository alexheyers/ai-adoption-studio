"use client";

import { useEffect, useRef } from "react";

/**
 * Subtiler Cursor-Spotlight · folgt der Maus mit Lag,
 * vergrößert sich über interaktiven Elementen.
 * Funktioniert nur auf Geräten mit Maus (pointer:fine).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = dotRef.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    let raf = 0;
    let big = false;

    function tick() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      el!.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function move(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement | null;
      const overInteractive = !!t?.closest("a, button, [data-cursor='lg']");
      if (overInteractive !== big) {
        big = overInteractive;
        el!.dataset.big = big ? "1" : "0";
      }
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="custom-cursor"
      data-big="0"
    />
  );
}
