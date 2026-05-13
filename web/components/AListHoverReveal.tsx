"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Agent = { n: string; name: string; role: string; img: string };

/**
 * Bento-Grid für die 10 Agents.
 * Featured-Cards (Pre-Audit, Reporter) sind 2x größer mit Bild-Header.
 * Standard-Cards zeigen Number + Name + Role.
 * Bei Hover: Bild fadet ein (für Cards mit Bild), Burgundy-Akzent.
 */
export default function AListHoverReveal({ agents }: { agents: Agent[] }) {
  const [active, setActive] = useState<number | null>(null);

  // Bento-Layout: 6 cols grid, featured agents span 2x2, standard 1x1
  // Pre-Audit (idx 1), Process-Auditor (idx 3), Reporter (idx 9) sind featured
  const isFeatured = (idx: number) => idx === 1 || idx === 3 || idx === 9;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-paper/10">
      {agents.map((a, idx) => {
        const featured = isFeatured(idx);
        return (
          <article
            key={a.n}
            onPointerEnter={() => setActive(idx)}
            onPointerLeave={() => setActive(null)}
            className={`relative bg-ink overflow-hidden group transition-all duration-500 ${
              featured
                ? "col-span-2 row-span-2 min-h-[280px] lg:min-h-[360px]"
                : "min-h-[180px] lg:min-h-[180px]"
            } ${active === idx ? "bg-[#141414]" : ""}`}
          >
            {/* Bild-Layer (nur für featured + on-hover für standard) */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                featured ? "opacity-30 group-hover:opacity-60" : "opacity-0 group-hover:opacity-25"
              }`}
            >
              <Image
                src={a.img}
                alt=""
                fill
                sizes={featured ? "(min-width: 1024px) 33vw, 66vw" : "(min-width: 1024px) 17vw, 33vw"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/50 to-ink/85" />
            </div>

            {/* Inhalt */}
            <div className={`relative h-full flex flex-col justify-between ${featured ? "p-6 sm:p-7 lg:p-10" : "p-4 sm:p-5 lg:p-6"}`}>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`font-mono font-medium tracking-wide transition-colors duration-500 ${
                    active === idx ? "text-gold" : "text-paper/40"
                  } ${featured ? "text-2xl lg:text-3xl" : "text-base lg:text-lg"}`}
                >
                  {a.n}
                </span>
                <span className={`font-mono text-[10px] tracking-eyebrow uppercase transition-colors duration-500 ${
                  active === idx ? "text-gold" : "text-paper/30"
                }`}>
                  ↗
                </span>
              </div>

              <div className={`${featured ? "" : "mt-6"}`}>
                <p
                  className={`text-paper transition-transform duration-500 ${
                    active === idx ? "translate-x-1" : ""
                  }`}
                  style={{
                    fontFamily: "var(--font-sans), sans-serif",
                    fontWeight: 700,
                    fontSize: featured ? "clamp(1.5rem, 3vw, 2.4rem)" : "clamp(0.8rem, 1.4vw, 1.2rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    overflowWrap: "anywhere",
                  }}
                >
                  {a.name}
                </p>
                <p className={`mt-2 font-mono text-[10px] tracking-eyebrow uppercase transition-colors duration-500 ${
                  active === idx ? "text-paper/80" : "text-paper/45"
                }`}>
                  {a.role}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
