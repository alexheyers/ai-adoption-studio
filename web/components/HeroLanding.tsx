"use client";

// "use client" wegen rotierender Sub-Line (setInterval, 4s-Cycle).
// Sonst alles statisch, alle Animationen pure CSS.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Easing für gestaffelten Entrance — die Bühne baut sich auf, statt zu „erscheinen".
const HERO_EASE = [0.16, 1, 0.3, 1] as const;
const HERO_DUR = 0.75;

const TAGLINES = [
  { for: "Hoteliers", note: "die KI greifbar machen wollen — ohne Berater-Maschinerie." },
  { for: "Hospitality-Berater", note: "die eine ehrliche Erfassungs-Schicht vor ihre eigene Arbeit setzen." },
  { for: "Tech-Teams in der Branche", note: "die ihre Häuser endlich strukturierter verstehen wollen." },
  { for: "Recruiter", note: "die Substanz vor Hochglanz suchen — und wissen, was Branchen-DNA wert ist." },
];

const TICKER = [
  "8 Agenten",
  "3 live",
  "Tag 23 / 86",
  "FastAPI · Claude Agent SDK",
  "Voice via ElevenLabs",
  "20 Jahre Hospitality",
  "Mosbach · DACH",
  "verfügbar 01.08.2026",
  "Klick-frei dokumentiert",
];

const CYCLE_MS = 4200;

export function HeroLanding({ day, total }: { day: number; total: number }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((p) => (p + 1) % TAGLINES.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const t = TAGLINES[idx];

  return (
    <section className="brutal-bg-dark relative overflow-hidden hero-section hero-landing">
      {/* ── Background-Layer 1 · Agentic-Structure als Ghost ─────────── */}
      <div aria-hidden="true" className="hero-structure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/agentic-structure.svg" alt="" className="hero-structure-svg" />
      </div>

      {/* ── Background-Layer 2 · Mesh-Gradient ─────────────────────── */}
      <div aria-hidden="true" className="hero-mesh" />

      {/* ── Background-Layer 3 · Wasserzeichen Tag-Zahl ────────────── */}
      <motion.span
        aria-hidden="true"
        className="hero-watermark"
        animate={{ x: [0, -8, 4, 0], y: [0, 4, -4, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        {day}
      </motion.span>

      {/* ── Top-Strip · Vol/Build + Live-Tag ───────────────────────── */}
      <div className="hl-topbar">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-4 flex items-center justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/55">
          <span className="flex items-center gap-3">
            <span className="text-gold">Vol. I</span>
            <span className="text-paper/25">·</span>
            <span>Build #023</span>
            <span className="text-paper/25 hidden md:inline">·</span>
            <span className="hidden md:inline">28. Mai 2026</span>
          </span>
          <span className="flex items-center gap-3">
            <motion.span
              className="hl-live-pill"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(122,132,113,0)",
                  "0 0 0 6px rgba(122,132,113,0.18)",
                  "0 0 0 0 rgba(122,132,113,0)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <span className="hl-live-dot" />
              live im bau
            </motion.span>
            <span className="text-paper/25">·</span>
            <span>Tag <span className="text-paper/80">{day}</span> / {total}</span>
          </span>
        </div>
      </div>

      {/* ── Hauptbereich ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-20 lg:pt-28 pb-12 lg:pb-16">

        {/* Editorial-Stamp links oben */}
        <motion.div
          className="hl-stamp hero-fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 0.1 }}
        >
          <span className="hl-stamp-glyph" aria-hidden="true">§</span>
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/55">
              Ausgabe · Tag {day}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-eyebrow uppercase text-gold/85">
              Aus dem Mosbacher Maschinenraum
            </p>
          </div>
        </motion.div>

        {/* Brand-Lock · die typografische Bühne */}
        <div className="hl-stage mt-10 lg:mt-14">
          <motion.p
            className="hl-eyebrow hero-fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 0.25 }}
          >
            <span aria-hidden="true" className="hl-eyebrow-bar" /> Was hier liegt
          </motion.p>

          <motion.h1
            className="hl-brand hero-fade-in"
            aria-label="AI-Adoption-Studio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 0.4 }}
          >
            <span className="hl-brand-line hl-brand-line-1">
              <span className="hl-brand-word">AI-Adoption</span>
            </span>
            <span className="hl-brand-line hl-brand-line-2">
              <span className="hl-brand-word hl-brand-italic">
                Studio<span className="hl-brand-dot">.</span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="hl-sub-fixed hero-fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 0.65 }}
          >
            Ein Multi-Agent-System für KI-Adoption.
            <br />
            <em className="italic-accent text-gold">Gebaut von einem Gastronom.</em>
          </motion.p>

          {/* Cycling Sub-Line */}
          <motion.div
            className="hl-cycle hero-fade-in"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 0.8 }}
          >
            <p className="hl-cycle-label">
              <span className="hl-cycle-bar" aria-hidden="true" /> Für
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                className="hl-cycle-rotor"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.55 }}
              >
                <p className="hl-cycle-for">{t.for}</p>
                <p className="hl-cycle-note">{t.note}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Byline-Grid · 3 Spalten */}
        <motion.div
          className="hl-byline mt-14 lg:mt-20 hero-fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: HERO_DUR, ease: HERO_EASE, delay: 1.0 }}
        >
          <div className="hl-byline-row">
            <div className="hl-byline-col">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-2">
                Wer baut
              </p>
              <p className="font-display text-xl lg:text-2xl text-paper leading-tight">
                <em>Alex Heyers</em>
              </p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/55 mt-1">
                Vibe Coding 2026
              </p>
            </div>
            <div className="hl-byline-col">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-2">
                Womit
              </p>
              <p className="font-display text-xl lg:text-2xl text-paper leading-tight">
                <em>20 Jahre</em>
              </p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/55 mt-1">
                Hospitality · Tresen · Direktion
              </p>
            </div>
            <div className="hl-byline-col">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-2">
                Wo
              </p>
              <p className="font-display text-xl lg:text-2xl text-paper leading-tight">
                <em>Mosbach · DACH</em>
              </p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/55 mt-1">
                verfügbar ab 01.08.2026
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom-Ticker · live-stat-marquee ──────────────────────── */}
      <div className="hl-ticker">
        <div className="hl-ticker-track">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="hl-ticker-set" aria-hidden={dup === 1}>
              {TICKER.map((item, i) => (
                <span key={`${dup}-${i}`} className="hl-ticker-item">
                  <span className="hl-ticker-bullet">●</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll-Hint ───────────────────────────────────────────── */}
      <div className="hl-scrollhint">
        <a href="#was-ist-das" className="hl-scrollhint-link hover-slide">
          <span className="font-mono text-[10px] tracking-eyebrow uppercase text-gold">
            Worum es geht
          </span>
          <span aria-hidden="true" className="hl-scrollhint-arrow">↓</span>
        </a>
      </div>

      {/* ── Styles ─────────────────────────────────────────────── */}
      <style>{`
        .hero-landing { min-height: 100vh; display: flex; flex-direction: column; }

        /* ── Top-Bar ───────────────────────────────────────────── */
        .hl-topbar {
          position: relative;
          z-index: 12;
          border-bottom: 1px solid rgba(250,246,238,0.10);
          background: rgba(10,10,10,0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hl-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.18rem 0.55rem;
          border: 1px solid rgba(122,132,113,0.5);
          border-radius: 2px;
          color: #7A8471;
          letter-spacing: 0.18em;
          font-size: 9px;
        }
        .hl-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7A8471;
          animation: hl-pulse 1.6s ease-in-out infinite;
        }
        @keyframes hl-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.55); }
        }

        /* ── Editorial-Stamp ────────────────────────────────────── */
        .hl-stamp {
          display: inline-flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding: 0.6rem 0.9rem 0.6rem 0.7rem;
          border-left: 2px solid #B8945F;
          background: rgba(184,148,95,0.05);
          max-width: max-content;
        }
        .hl-stamp-glyph {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #B8945F;
          font-size: 1.6rem;
          line-height: 0.9;
          margin-top: -0.15rem;
        }

        /* ── Brand-Lock · die Bühne ─────────────────────────────── */
        .hl-stage {
          position: relative;
        }
        .hl-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B8945F;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.6rem;
        }
        .hl-eyebrow-bar {
          width: 36px; height: 1px; background: #B8945F;
        }

        .hl-brand {
          font-family: var(--font-sans), "Bricolage Grotesque", "Helvetica Neue", sans-serif;
          font-weight: 700;
          font-size: clamp(3.5rem, 12vw, 12rem);
          line-height: 0.84;
          letter-spacing: -0.055em;
          color: #FAF6EE;
          word-break: keep-all;
          margin: 0;
        }
        .hl-brand-line { display: block; overflow: hidden; }
        .hl-brand-word { display: inline-block; }
        .hl-brand-italic {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-variation-settings: "WONK" 1, "SOFT" 100, "opsz" 144;
          color: #D4B27C;
          letter-spacing: -0.03em;
        }
        .hl-brand-dot {
          color: #B8945F;
          font-style: normal;
        }

        /* Pro-Zeile Letter-Cascade-Reveal */
        .hl-brand-line-1 .hl-brand-word { animation: hl-line-up 1.0s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .hl-brand-line-2 .hl-brand-word { animation: hl-line-up 1.0s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        @keyframes hl-line-up {
          from { opacity: 0; transform: translateY(112%); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Scroll-driven type-pressure auf der Brand-Lock */
        @supports (animation-timeline: scroll(root)) {
          .hl-brand-italic {
            animation: hl-type-pressure linear both;
            animation-timeline: scroll(root);
            animation-range: 0 70vh;
          }
          @keyframes hl-type-pressure {
            from { font-variation-settings: "WONK" 1, "SOFT" 100, "opsz" 144; letter-spacing: -0.03em; }
            to   { font-variation-settings: "WONK" 1, "SOFT" 20,  "opsz" 144; letter-spacing: -0.08em; }
          }
        }

        /* ── Sub-Line statisch ──────────────────────────────────── */
        .hl-sub-fixed {
          margin-top: 2.2rem;
          font-family: var(--font-display), Georgia, serif;
          font-weight: 400;
          font-size: clamp(1.35rem, 2.2vw, 2.1rem);
          line-height: 1.3;
          color: #D6D1C2;
          max-width: 32ch;
        }

        /* ── Cycling Sub-Line ───────────────────────────────────── */
        .hl-cycle {
          margin-top: 2.4rem;
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: 1rem 1.5rem;
          align-items: start;
          max-width: 60rem;
        }
        @media (max-width: 700px) {
          .hl-cycle { grid-template-columns: 1fr; gap: 0.4rem; }
        }
        .hl-cycle-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B8945F;
          padding-top: 0.6rem;
        }
        .hl-cycle-bar {
          width: 24px; height: 1px; background: #B8945F;
          display: inline-block;
        }
        .hl-cycle-rotor {
          min-height: 4.5rem;
          animation: hl-cycle-in 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes hl-cycle-in {
          0%   { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        .hl-cycle-for {
          font-family: var(--font-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 2.4vw, 2.4rem);
          line-height: 1;
          letter-spacing: -0.025em;
          color: #FAF6EE;
        }
        .hl-cycle-note {
          margin-top: 0.5rem;
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 1.4vw, 1.25rem);
          line-height: 1.4;
          color: #B8945F;
          max-width: 48ch;
        }

        /* ── Byline-Grid ────────────────────────────────────────── */
        .hl-byline {
          border-top: 1px solid rgba(250,246,238,0.10);
          padding-top: 2rem;
        }
        .hl-byline-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2rem;
        }
        @media (max-width: 700px) {
          .hl-byline-row { grid-template-columns: 1fr; gap: 1.5rem; }
        }
        .hl-byline-col {
          padding-right: 1rem;
        }
        .hl-byline-col + .hl-byline-col {
          padding-left: 1.5rem;
          border-left: 1px dashed rgba(250,246,238,0.12);
        }
        @media (max-width: 700px) {
          .hl-byline-col + .hl-byline-col { border-left: none; padding-left: 0; padding-top: 1rem; border-top: 1px dashed rgba(250,246,238,0.12); }
        }

        /* ── Bottom Live-Ticker ─────────────────────────────────── */
        .hl-ticker {
          position: relative;
          z-index: 11;
          margin-top: auto;
          overflow: hidden;
          border-top: 1px solid rgba(250,246,238,0.10);
          border-bottom: 1px solid rgba(250,246,238,0.10);
          background: rgba(10,10,10,0.5);
        }
        .hl-ticker-track {
          display: flex;
          width: max-content;
          animation: hl-ticker-scroll 60s linear infinite;
        }
        .hl-ticker:hover .hl-ticker-track { animation-play-state: paused; }
        @keyframes hl-ticker-scroll {
          to { transform: translateX(-50%); }
        }
        .hl-ticker-set {
          display: flex;
          gap: 2.4rem;
          padding: 0.9rem 1.2rem;
          white-space: nowrap;
        }
        .hl-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D6D1C2;
        }
        .hl-ticker-bullet {
          color: #B8945F;
          font-size: 0.6em;
        }

        /* ── Scroll-Hint ────────────────────────────────────────── */
        .hl-scrollhint {
          position: absolute;
          right: 2rem;
          bottom: 4.5rem;
          z-index: 12;
          display: none;
        }
        @media (min-width: 1100px) {
          .hl-scrollhint { display: block; }
        }
        .hl-scrollhint-link {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          color: #B8945F;
          text-decoration: none;
        }
        .hl-scrollhint-arrow {
          font-size: 1.4rem;
          line-height: 1;
          animation: hl-scrollhint-bob 2.2s ease-in-out infinite;
        }
        @keyframes hl-scrollhint-bob {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50%      { transform: translateY(6px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hl-brand-line-1 .hl-brand-word,
          .hl-brand-line-2 .hl-brand-word,
          .hl-cycle-rotor,
          .hl-scrollhint-arrow,
          .hl-live-dot,
          .hl-ticker-track,
          .hl-brand-italic {
            animation: none !important;
          }
          .hl-brand-line-1 .hl-brand-word,
          .hl-brand-line-2 .hl-brand-word { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
