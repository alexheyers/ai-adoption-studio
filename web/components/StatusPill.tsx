/**
 * StatusPill — drei Zustände, ein Schwung. Editorial-Restraint:
 * kleiner Mono-Text, dünne Linie, ein Indikator-Glyph. Keine Buttons.
 */

type Status = "live" | "building" | "planned";

const STYLES: Record<Status, { glyph: string; label: string; color: string; ring: string }> = {
  live:     { glyph: "✓", label: "Live",    color: "text-sage",     ring: "border-sage/40" },
  building: { glyph: "◐", label: "In Bau",  color: "text-gold",     ring: "border-gold/40" },
  planned:  { glyph: "○", label: "Geplant", color: "text-ink3",     ring: "border-ink3/30" },
};

export function StatusPill({ status, light = false }: { status: Status; light?: boolean }) {
  const s = STYLES[status];
  const labelColor = light ? "text-paper/70" : "text-ink/70";
  return (
    <span className={`status-pill inline-flex items-center gap-1.5 px-2 py-0.5 border ${s.ring} ${s.color} font-mono text-[9px] tracking-eyebrow uppercase leading-none`}>
      <span aria-hidden>{s.glyph}</span>
      <span className={labelColor}>{s.label}</span>
    </span>
  );
}
