"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StatusPill } from "@/components/StatusPill";
import { BUILD_LOG } from "@/lib/build-log";

/**
 * BuildLogTimeline — Hybrid Timeline + Magazine-Cascade.
 *
 * Linke Spalte: riesige Tag-Nummer, gestrichelte Vertikal-Linie die sich
 * beim Scrollen zeichnet (jetzt via framer-motion useScroll — browser-kompatibel),
 * Knoten pulsiert beim Eintreten ins Viewport.
 *
 * Rechte Spalte: Karte slidet von rechts ein, Titel-Wörter cascaden einzeln
 * rein, StatusPill bootet on-enter (scale 0 → 1).
 *
 * Client Component — framer-motion whileInView + useScroll für smooth animations.
 * Die CSS-`animation-timeline:view()`-Bloecke bleiben als Fallback fuer Browser
 * ohne JS bzw. fuer prefers-reduced-motion.
 */

function splitWords(s: string): string[] {
  // Split on whitespace but keep punctuation glued to words.
  return s.split(/\s+/);
}

export function BuildLogTimeline() {
  const entries = BUILD_LOG;

  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const spineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="build-log"
      className="brutal-bg-light border-b-2 border-ink scroll-reveal relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 lg:py-32">
        {/* ── Section-Head ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-8 mb-16">
          <div className="col-span-12 lg:col-span-2">
            <p className="eyebrow">· 01 · Build-Log</p>
            <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/55">
              Tag 06 → Tag 28
            </p>
          </div>
          <div className="col-span-12 lg:col-span-10">
            <h2 className="h-brutal-md text-ink">
              Was hier wirklich <em className="italic-accent text-burgundy">entstanden</em> ist.
            </h2>
            <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
              Kein Marketing, kein Roadmap-Theater. Jeder Eintrag steht auf einem echten
              Arbeitstag — mit Datum, mit dem, was lief, und ehrlich auch mit dem, was länger
              gedauert hat als gedacht. Läuft etwas, steht es da. Häng ich fest, auch.
            </p>
          </div>
        </div>

        {/* ── Timeline-Container ────────────────────────────────── */}
        <ol ref={timelineRef} className="bl-timeline" aria-label="Build-Log Einträge nach Datum">
          {/* Globale Spine-Fill-Bar · scroll-progress-gebunden */}
          <motion.div
            className="bl-spine-global"
            aria-hidden="true"
            style={{ scaleY: spineScaleY, transformOrigin: "top" }}
          />
          {entries.map((b, i) => {
            const isLatest = i === 0;
            const dayNum = b.day.replace(/[^0-9]/g, "") || String(i + 1);
            const words = splitWords(b.title);
            return (
              <li
                key={`${b.iso}-${i}`}
                className={`bl-row ${isLatest ? "is-latest" : ""}`}
                style={{ "--bl-i": i } as React.CSSProperties}
              >
                {/* Knoten-Linie · Knoten markiert Eintrag */}
                <div className="bl-spine" aria-hidden="true">
                  <span className="bl-node">
                    {isLatest && (
                      <motion.span
                        className="bl-node-pulse"
                        aria-hidden="true"
                        animate={{ scale: [0.6, 1.2, 0.6], opacity: [0, 0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </span>
                </div>

                {/* Linke Spalte · Tag-Nummer riesig */}
                <div className="bl-day-col">
                  <p className="bl-day-label font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                    {isLatest ? (
                      <span className="bl-live-tag">
                        <span className="bl-live-dot" aria-hidden="true" /> neu · heute
                      </span>
                    ) : (
                      <>Tag {dayNum.padStart(2, "0")}</>
                    )}
                  </p>
                  <motion.p
                    className="bl-day-num"
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {dayNum.padStart(2, "0")}
                  </motion.p>
                  <p className="bl-day-date font-mono text-[10px] tracking-eyebrow uppercase text-ink/55">
                    {b.date}
                  </p>
                </div>

                {/* Rechte Spalte · Karte */}
                <motion.article
                  className="bl-card"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="bl-card-meta">
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.15 }}
                    >
                      <StatusPill status={b.status} />
                    </motion.div>
                    <span className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/40">
                      Eintrag {String(entries.length - i).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="bl-card-title">
                    {words.map((w, wi) => (
                      <motion.span
                        key={wi}
                        className="bl-word"
                        style={{ "--w": wi } as React.CSSProperties}
                        initial={{ opacity: 0, y: "28%" }}
                        whileInView={{ opacity: 1, y: "0%" }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.05 + wi * 0.04 }}
                      >
                        <em>{w}</em>
                      </motion.span>
                    ))}
                  </h3>

                  <p className="bl-card-body">{b.body}</p>
                </motion.article>
              </li>
            );
          })}
        </ol>

        <p className="mt-12 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
          Automatisch aus Commit-Historie + Projekt-Kanban · letzter Eintrag {entries[0]?.date}
        </p>
      </div>

      {/* ── Styles ─────────────────────────────────────────────── */}
      <style>{`
        .bl-timeline {
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
        }

        /* Globale Spine-Fill-Bar · framer-motion driven */
        .bl-spine-global {
          position: absolute;
          left: 30px;          /* mittig zu .bl-spine (60px column / 2) */
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #B8945F, #6B2737);
          pointer-events: none;
          z-index: 1;
          border-radius: 1px;
        }
        @media (max-width: 900px) {
          .bl-spine-global {
            left: 24px;        /* mittig zu .bl-spine (48px column / 2) */
          }
        }

        .bl-row {
          position: relative;
          display: grid;
          grid-template-columns: 60px minmax(160px, 220px) 1fr;
          gap: 1.5rem 2.5rem;
          padding: 3rem 0 3.5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .bl-row {
            grid-template-columns: 48px 1fr;
            gap: 1rem 1.25rem;
            padding: 2rem 0 2.25rem;
          }
          .bl-day-col { grid-column: 2; }
          .bl-card    { grid-column: 1 / -1; padding-left: 0; }
        }

        /* ── Spine (vertikale Linie + Knoten) ─────────────────── */
        .bl-spine {
          grid-column: 1;
          grid-row: 1 / -1;
          position: relative;
          width: 100%;
          align-self: stretch;
        }

        /* Linie zeichnet sich · animation-timeline:view() (Fallback) */
        .bl-spine::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: -3.5rem;   /* visuell zur naechsten Karte verbinden */
          width: 1px;
          transform: translateX(-50%);
          background-image: repeating-linear-gradient(
            to bottom,
            #B8945F 0 6px,
            transparent 6px 12px
          );
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 1px 0%;
          /* Fallback ohne view-timeline */
          background-size: 1px 100%;
        }

        @supports (animation-timeline: view()) {
          .bl-spine::before {
            background-size: 1px 0%;
            animation: bl-line-draw linear both;
            animation-timeline: view();
            animation-range: entry 0% cover 60%;
          }
          @keyframes bl-line-draw {
            from { background-size: 1px 0%; }
            to   { background-size: 1px 100%; }
          }
        }

        /* Letzte Karte: keine Linie nach unten */
        .bl-row:last-child .bl-spine::before { display: none; }

        /* Knoten */
        .bl-node {
          position: absolute;
          top: 0.65rem;
          left: 50%;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #FAF6EE;
          border: 2px solid #B8945F;
          transform: translateX(-50%) scale(0.7);
          opacity: 0.6;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s;
          z-index: 2;
        }
        @supports (animation-timeline: view()) {
          .bl-node {
            animation: bl-node-pop linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 50%;
          }
          @keyframes bl-node-pop {
            from { transform: translateX(-50%) scale(0.4); opacity: 0; }
            to   { transform: translateX(-50%) scale(1);   opacity: 1; }
          }
        }
        .bl-row.is-latest .bl-node {
          background: #B8945F;
          border-color: #6B2737;
          width: 16px;
          height: 16px;
          opacity: 1;
        }
        .bl-node-pulse {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: rgba(184, 148, 95, 0.35);
        }

        /* ── Day-Column ───────────────────────────────────────── */
        .bl-day-col {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .bl-day-label { line-height: 1; }
        .bl-live-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.5rem;
          border: 1px solid #6B2737;
          color: #6B2737;
          border-radius: 2px;
        }
        .bl-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6B2737;
          animation: bl-pulse-dot 1.4s ease-in-out infinite;
        }
        @keyframes bl-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.6); }
        }

        .bl-day-num {
          font-family: var(--font-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(4rem, 8vw, 7.5rem);
          line-height: 0.85;
          letter-spacing: -0.05em;
          color: #161616;
          margin-top: 0.4rem;
        }
        @supports (animation-timeline: view()) {
          .bl-day-num {
            animation: bl-day-in linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 60%;
          }
          @keyframes bl-day-in {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
        .bl-row.is-latest .bl-day-num { color: #6B2737; }

        .bl-day-date { margin-top: 0.25rem; }

        /* ── Card ─────────────────────────────────────────────── */
        .bl-card {
          position: relative;
          padding-left: 0;
        }
        @supports (animation-timeline: view()) {
          .bl-card {
            animation: bl-card-in linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 60%;
          }
          @keyframes bl-card-in {
            from { opacity: 0; transform: translateX(50px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        }

        .bl-card-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .bl-card-title {
          font-family: var(--font-display), Georgia, serif;
          font-weight: 500;
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          line-height: 1.15;
          color: #161616;
          margin-bottom: 1.25rem;
          font-style: italic;
        }

        /* Wort-fuer-Wort Cascade · margin statt Whitespace-Textnode (inline-block frisst Spaces) */
        .bl-word {
          display: inline-block;
          margin-right: 0.28em;
        }
        @supports (animation-timeline: view()) {
          .bl-word {
            animation: bl-word-rise linear both;
            animation-timeline: view();
            animation-range: entry calc(15% + var(--w, 0) * 2%) entry calc(45% + var(--w, 0) * 2%);
          }
          @keyframes bl-word-rise {
            from { opacity: 0; transform: translateY(28%); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }

        .bl-card-body {
          font-family: var(--font-sans), sans-serif;
          font-size: 1rem;
          line-height: 1.65;
          color: rgba(22, 22, 22, 0.75);
          max-width: 60ch;
        }

        /* ── Latest-Row · subtile Highlight-Treatment ─────────── */
        .bl-row.is-latest::before {
          content: "";
          position: absolute;
          left: -1rem;
          right: -1rem;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(184, 148, 95, 0.07), transparent 60%);
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .bl-node,
          .bl-day-num,
          .bl-card,
          .bl-word,
          .bl-card-meta .status-pill,
          .bl-node-pulse,
          .bl-live-dot,
          .bl-spine::before,
          .bl-spine-global {
            animation: none !important;
            opacity: 1;
            transform: none;
            background-size: 1px 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
