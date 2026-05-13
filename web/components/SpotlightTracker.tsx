"use client";
import { useEffect } from "react";

/**
 * Setzt --mx/--my CSS-Variablen auf allen .spotlight-Elementen,
 * sodass das Radial-Gradient der Maus folgt.
 * Verwendet pointerover/pointermove → leichtgewichtig, kein Listener pro Card.
 */
export default function SpotlightTracker() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(".spotlight") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
