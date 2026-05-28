"use client";

// "use client" wegen Cycle-State (setInterval).
// Konzept: Sequenz-Flow — 8 Agenten als Kette, verbunden durch zeichnende
// SVG-Linien, am Ende ein OUTPUT-Knoten. Pro Cycle wandert der "lit pointer"
// einen Schritt weiter: Agent N aktiv → Linie N→N+1 zeichnet sich → Agent N+1
// aktiv. Nach Agent 8 erreicht der Flow den OUTPUT (Report · Excel · PDF) mit
// Celebration-Glow, dann Reset.

import { useEffect, useState, useRef } from "react";

type Status = "live" | "building" | "planned";

type Agent = {
  n: string;
  name: string;
  role: string;
  punch: string;
  meta: string;
  status: Status;
};

const AGENTS: Agent[] = [
  { n: "01", name: "Web-Research",       role: "Vorab-Recherche · Region · Markt", punch: "Bevor jemand ein Wort sagt — schau, was das Internet über das Haus erzählt.", meta: "WebSearch · Bing API · 60–120s",                       status: "live" },
  { n: "02", name: "Dokumenten-Analyst", role: "liest GuV · Reports · Listen",     punch: "Zahlen lesen, nicht raten. Aus PDF wird JSON.",                                    meta: "claude-3-5-sonnet · Pydantic-Output · ~45s/Dok",   status: "live" },
  { n: "03", name: "Prozess-Auditor",    role: "wo Zeit verloren geht",            punch: "Wer im Lager sucht, kassiert nicht. Suchen ist sichtbar. Kassieren auch.",        meta: "claude-3-5-sonnet · 12-Domänen-Schema",            status: "live" },
  { n: "04", name: "Use-Case-Generator", role: "konkrete Ansatzpunkte",            punch: "Drei Use-Cases, die ein normales Haus tatsächlich umsetzen kann. Nicht zwanzig.", meta: "claude-3-5-sonnet · 3-Use-Case-Limit",             status: "building" },
  { n: "05", name: "Tool-Empfehlung",    role: "Werkzeuge + DSGVO",                punch: "Welches Tool, für welche Stelle, mit welcher Vertragsklausel. Kein Tool-Bingo.",   meta: "claude-3-5-sonnet · tools_db · DPA-Check",         status: "building" },
  { n: "06", name: "Wirtschaftlichkeit", role: "Aufwand · Nutzen · Amortisation",  punch: "Wann ist es bezahlt? In welchem Quartal? Mit welcher Annahme?",                  meta: "claude-3-5-sonnet · ROI-Modell (geplant)",         status: "planned" },
  { n: "07", name: "Compliance-Check",   role: "DSGVO · AI-Act · Branche",         punch: "Was darf rein, was muss raus, was muss dokumentiert sein. Nüchtern.",            meta: "claude-3-5-sonnet · compliance_db (geplant)",      status: "planned" },
  { n: "08", name: "Reporter",           role: "bündelt zu Report · Excel · PDF",  punch: "Der letzte am Pass. Schreibt das Buch, das die anderen sieben recherchiert haben.", meta: "claude-3-5-sonnet · jinja2 · xlsxwriter · ReportLab", status: "building" },
];

// Output-State als pseudo-step nach dem letzten Agent
const OUTPUT_STEP = {
  n: "OUT",
  name: "Report · Excel · PDF",
  role: "Ausgabe — automatisch generiert",
  punch: "Drei Dateien. Belegt, lesbar, reproduzierbar. Das, was am Montagmorgen auf dem Tisch liegen darf.",
  meta: "Jinja2-Template · xlsxwriter · ReportLab",
};

const STEP_COUNT = AGENTS.length + 1; // 8 Agenten + 1 Output
const TICK_MS = 1600; // pro Schritt
const LOG_HISTORY = 5;

export default function AgentsStage() {
  const [step, setStep] = useState(0); // 0..7 = agent, 8 = output
  const [log, setLog] = useState<{ key: number; line: string; ts: string; kind: "agent" | "report" }[]>([]);
  const keyRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      setStep((prev) => {
        const next = (prev + 1) % STEP_COUNT;
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        keyRef.current += 1;

        if (prev < AGENTS.length) {
          // ein agent ist gerade fertig geworden
          const done = AGENTS[prev];
          const elapsed = (Math.random() * 40 + 8).toFixed(1);
          setLog((old) =>
            [
              {
                key: keyRef.current,
                ts,
                kind: "agent" as const,
                line: `agent_${done.n}.run() → ok · ${elapsed}s · ${done.role.split("·")[0].trim().toLowerCase().replace(/\s+/g, "_")}`,
              },
              ...old,
            ].slice(0, LOG_HISTORY),
          );
        } else {
          // prev war OUTPUT — Cycle wird neu starten
          setLog((old) =>
            [
              {
                key: keyRef.current,
                ts,
                kind: "report" as const,
                line: `report.pdf · report.xlsx · report.md → /report/[id] · ready`,
              },
              ...old,
            ].slice(0, LOG_HISTORY),
          );
        }
        return next;
      });
    };
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const isOutputStep = step === AGENTS.length;
  const curAgent = isOutputStep ? null : AGENTS[step];
  const cur = isOutputStep ? OUTPUT_STEP : (curAgent as Agent);

  return (
    <section
      id="agents-runner"
      className="brutal-bg-dark border-b-2 border-ink scroll-reveal relative overflow-hidden"
      aria-label="Live-Pipeline · 8 Agenten + Output"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
        {/* ── Section-Head ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-8 mb-12">
          <div className="col-span-12 lg:col-span-3">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">
              · 06 · Die Pipeline · sequenz-flow
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-paper/45">
              {STEP_COUNT} Schritte · alle 1,6 s der nächste
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <h2 className="h-brutal-md text-paper">
              Einer nach dem <em className="italic-accent text-gold">anderen</em>.
              <br />
              Bis zum <em className="italic-accent text-gold">Report</em>.
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-paper/75 leading-relaxed">
              Brigade-Logik. Jeder Agent hat einen Job — und nur den. Wenn er sauber abgegeben
              hat, fängt der nächste an. Sonst nicht. Am Ende der Reihe steht <em className="italic-accent text-paper">ein Bericht</em>,
              den ein Mensch lesen kann.
            </p>
          </div>
        </div>

        {/* ── Spotlight: aktiver Schritt groß ───────────────────── */}
        <div
          className={`runner-spotlight ${isOutputStep ? "is-output" : ""}`}
          key={`spot-${step}`}
        >
          <div className="runner-spot-grid">
            <div className="runner-spot-num-col">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold/80 mb-2">
                {isOutputStep ? "Ausgabe · zusammengesetzt" : "Agent · jetzt aktiv"}
              </p>
              <span aria-hidden="true" className="runner-spot-num">
                {isOutputStep ? "✓" : cur.n}
              </span>
              <div className="runner-spot-meta">
                {!isOutputStep && (
                  <span className={`runner-spot-status runner-spot-status-${(curAgent as Agent).status}`}>
                    <span className="runner-spot-dot" />
                    {(curAgent as Agent).status === "live" ? "live" : (curAgent as Agent).status === "building" ? "im bau" : "geplant"}
                  </span>
                )}
                {isOutputStep && (
                  <span className="runner-spot-status runner-spot-status-output">
                    <span className="runner-spot-dot" />
                    abgabe komplett
                  </span>
                )}
                <span className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/40">
                  {cur.meta}
                </span>
              </div>
            </div>
            <div className="runner-spot-content">
              <h3 className="runner-spot-name">
                <em className="italic-accent text-paper">{cur.name}</em>
              </h3>
              <p className="runner-spot-role">{cur.role}</p>
              <p className="runner-spot-punch">{cur.punch}</p>
            </div>
          </div>
        </div>

        {/* ── Flow-Strip · 8 Agenten + Arrows + Output ─────────── */}
        <div className="flow-strip" role="list" aria-label="Pipeline-Sequenz">
          {AGENTS.map((a, i) => {
            const isActive = i === step;
            const isDone = i < step || isOutputStep;
            const incomingDrawn = i > 0 && (i <= step || isOutputStep);
            return (
              <div
                key={a.n}
                className="flow-cell"
                role="listitem"
              >
                {/* Eingehende Verbindung (außer beim ersten Agent) */}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`flow-edge ${incomingDrawn ? "is-drawn" : ""}`}
                  >
                    <svg viewBox="0 0 100 10" preserveAspectRatio="none">
                      <line x1="0" y1="5" x2="100" y2="5" />
                    </svg>
                    <span className="flow-edge-tip" />
                  </span>
                )}

                {/* Agent-Card */}
                <article
                  className={`flow-card ${isActive ? "is-active" : isDone ? "is-done" : "is-queued"}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="flow-card-num">{a.n}</span>
                  <span className="flow-card-name">{a.name}</span>
                  <span className="flow-card-state">
                    {isActive ? (
                      <span className="flow-card-spinner" aria-label="läuft" />
                    ) : isDone ? (
                      <svg viewBox="0 0 12 12" width="12" height="12" aria-label="erledigt">
                        <path d="M2 6.5 L5 9 L10 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="flow-card-pending" aria-hidden="true">•</span>
                    )}
                  </span>
                </article>
              </div>
            );
          })}

          {/* Lange Output-Verbindung */}
          <div className="flow-cell flow-cell-output">
            <span
              aria-hidden="true"
              className={`flow-edge flow-edge-long ${isOutputStep ? "is-drawn" : ""}`}
            >
              <svg viewBox="0 0 100 10" preserveAspectRatio="none">
                <line x1="0" y1="5" x2="100" y2="5" />
              </svg>
              <span className="flow-edge-tip flow-edge-tip-strong" />
            </span>

            {/* Output-Card */}
            <article
              className={`flow-output ${isOutputStep ? "is-active" : "is-queued"}`}
              aria-current={isOutputStep ? "step" : undefined}
            >
              <span className="flow-output-num">OUT</span>
              <span className="flow-output-name">Report · Excel · PDF</span>
              <span className="flow-output-state">
                {isOutputStep ? (
                  <svg viewBox="0 0 12 12" width="14" height="14" aria-label="abgabe komplett">
                    <path d="M2 6.5 L5 9 L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="flow-output-pending" aria-hidden="true">⏳</span>
                )}
              </span>
            </article>
          </div>
        </div>

        {/* ── Console-Log ──────────────────────────────────────── */}
        <div className="runner-console">
          <div className="runner-console-bar">
            <span className="runner-console-dot runner-console-dot-r" />
            <span className="runner-console-dot runner-console-dot-y" />
            <span className="runner-console-dot runner-console-dot-g" />
            <span className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/55 ml-3">
              orchestrator.log · live tail
            </span>
            <span className="ml-auto font-mono text-[10px] tracking-eyebrow uppercase text-paper/35">
              FastAPI · pipeline_runner.py
            </span>
          </div>
          <pre className="runner-console-body" aria-live="polite" aria-atomic="false">
            {log.length === 0 ? (
              <span className="runner-console-line runner-console-line-muted">
                <span className="runner-console-ts">[--:--:--]</span>{" "}
                orchestrator boot · steps={STEP_COUNT} · cycle={TICK_MS}ms
              </span>
            ) : (
              log.map((entry) => (
                <span
                  key={entry.key}
                  className={`runner-console-line ${entry.kind === "report" ? "runner-console-line-report" : ""}`}
                >
                  <span className="runner-console-ts">[{entry.ts}]</span>{" "}
                  <span className="runner-console-pid">{entry.kind === "report" ? "out" : "orch"}</span>{" "}
                  <span className="runner-console-arrow">›</span>{" "}
                  {entry.line}
                </span>
              ))
            )}
          </pre>
        </div>

        {/* ── Footer · run-control ──────────────────────────────── */}
        <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-paper/40 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Demo-Cycle läuft im Browser
          </span>
          <span className="text-paper/20">·</span>
          <span>echte Pipeline: <code className="text-gold/80">python -m agent_patterns.example_run</code></span>
        </p>
      </div>

      {/* ── Styles ─────────────────────────────────────────────── */}
      <style>{`
        /* ── Spotlight ─────────────────────────────────────────── */
        .runner-spotlight {
          position: relative;
          padding: 3rem 0 3.5rem;
          border-top: 1px solid rgba(250,246,238,0.1);
          border-bottom: 1px solid rgba(250,246,238,0.1);
          background:
            radial-gradient(60% 50% at 70% 50%, rgba(184,148,95,0.10), transparent 60%),
            radial-gradient(40% 40% at 20% 80%, rgba(107,39,55,0.10), transparent 60%);
          overflow: hidden;
          animation: runner-spot-flash ${TICK_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .runner-spotlight.is-output {
          background:
            radial-gradient(80% 60% at 50% 50%, rgba(184,148,95,0.22), transparent 65%),
            radial-gradient(40% 40% at 20% 80%, rgba(122,132,113,0.18), transparent 60%);
        }
        @keyframes runner-spot-flash {
          0%   { opacity: 0.0; transform: translateY(8px); filter: blur(6px); }
          25%  { opacity: 1.0; transform: translateY(0);   filter: blur(0); }
          100% { opacity: 1.0; transform: translateY(0);   filter: blur(0); }
        }

        .runner-spot-grid {
          display: grid;
          grid-template-columns: minmax(180px, 280px) 1fr;
          gap: 3rem;
          align-items: start;
          padding: 0 2rem;
        }
        @media (max-width: 900px) {
          .runner-spot-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 0 1rem; }
        }

        .runner-spot-num {
          display: block;
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-variation-settings: "WONK" 1, "SOFT" 100, "opsz" 144;
          font-size: clamp(8rem, 16vw, 16rem);
          line-height: 0.78;
          letter-spacing: -0.05em;
          color: #D4B27C;
          text-shadow: 0 0 30px rgba(212,178,124,0.35);
          animation: runner-num-in 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .runner-spotlight.is-output .runner-spot-num {
          color: #FAF6EE;
          text-shadow: 0 0 50px rgba(212,178,124,0.6);
        }
        @keyframes runner-num-in {
          0%   { opacity: 0; transform: translateY(40px) rotate(-4deg); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0)     rotate(0deg); filter: blur(0); }
        }

        .runner-spot-meta {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .runner-spot-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.3rem 0.6rem;
          border-radius: 2px;
          border: 1px solid currentColor;
          width: max-content;
        }
        .runner-spot-status-live     { color: #7A8471; }
        .runner-spot-status-building { color: #B8945F; }
        .runner-spot-status-planned  { color: #6B7280; }
        .runner-spot-status-output   { color: #D4B27C; }
        .runner-spot-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor;
          animation: runner-pulse 1.4s ease-in-out infinite;
        }
        @keyframes runner-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.6); }
        }

        .runner-spot-content { padding-top: 1rem; }
        .runner-spot-name {
          font-family: var(--font-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #FAF6EE;
          animation: runner-name-in 700ms cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }
        @keyframes runner-name-in {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .runner-spot-role {
          margin-top: 0.8rem;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8945F;
          animation: runner-name-in 700ms cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }
        .runner-spot-punch {
          margin-top: 1.6rem;
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: clamp(1.2rem, 1.9vw, 1.65rem);
          line-height: 1.35;
          color: #D6D1C2;
          max-width: 64ch;
          animation: runner-name-in 800ms cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        /* ── Flow-Strip · sequenzielle Card + Arrow + Output ───── */
        .flow-strip {
          margin-top: 3rem;
          display: flex;
          align-items: stretch;
          gap: 0;
          padding: 1rem 0 1.25rem;
          overflow-x: auto;
          scrollbar-width: thin;
        }
        @media (max-width: 1100px) {
          .flow-strip { padding-bottom: 0.5rem; }
        }

        .flow-cell {
          display: flex;
          align-items: stretch;
          flex: 0 0 auto;
          min-width: 0;
        }
        .flow-cell:first-child .flow-card { margin-left: 0; }

        /* ── Edge zwischen Karten ──────────────────────────────── */
        .flow-edge {
          position: relative;
          display: flex;
          align-items: center;
          flex: 0 0 auto;
          width: 36px;
          height: auto;
          align-self: center;
        }
        .flow-edge svg {
          width: 100%;
          height: 10px;
          overflow: visible;
        }
        .flow-edge line {
          stroke: rgba(184, 148, 95, 0.22);
          stroke-width: 2;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.45s;
        }
        .flow-edge.is-drawn line {
          stroke: #B8945F;
          stroke-dashoffset: 0;
          filter: drop-shadow(0 0 6px rgba(184, 148, 95, 0.6));
        }
        .flow-edge-tip {
          position: absolute;
          right: -2px;
          top: 50%;
          width: 7px; height: 7px;
          transform: translate(0, -50%) rotate(45deg);
          border-top: 2px solid rgba(184,148,95,0.22);
          border-right: 2px solid rgba(184,148,95,0.22);
          transition: border-color 0.4s, filter 0.4s;
        }
        .flow-edge.is-drawn .flow-edge-tip {
          border-top-color: #B8945F;
          border-right-color: #B8945F;
          filter: drop-shadow(0 0 4px rgba(184, 148, 95, 0.8));
        }

        /* Lange Output-Edge: breiter und deutlicher */
        .flow-edge-long {
          width: 72px;
          margin-left: 8px;
        }
        .flow-edge-long line {
          stroke-width: 3;
        }
        .flow-edge-tip-strong {
          width: 10px; height: 10px;
          border-top-width: 3px;
          border-right-width: 3px;
        }

        /* ── Agent-Card ────────────────────────────────────────── */
        .flow-card {
          flex: 0 0 auto;
          min-width: 110px;
          max-width: 150px;
          background: rgba(26, 20, 16, 0.85);
          border: 1px solid rgba(184,148,95,0.22);
          padding: 0.7rem 0.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          text-align: center;
          color: rgba(250,246,238,0.55);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.45s, border-color 0.45s, background 0.45s, box-shadow 0.45s, color 0.45s;
        }
        .flow-card.is-active {
          color: #FAF6EE;
          border-color: #D4B27C;
          background: rgba(40, 30, 18, 0.95);
          transform: translateY(-6px);
          box-shadow: 0 12px 28px -10px rgba(184,148,95,0.45), 0 0 0 1px rgba(212,178,124,0.5) inset;
        }
        .flow-card.is-done {
          color: rgba(250,246,238,0.4);
          border-color: rgba(122,132,113,0.35);
        }
        .flow-card.is-queued { opacity: 0.55; }
        .flow-card-num {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #B8945F;
          font-weight: 600;
        }
        .flow-card.is-done .flow-card-num   { color: #7A8471; }
        .flow-card.is-queued .flow-card-num { color: rgba(184,148,95,0.4); }
        .flow-card.is-active .flow-card-num { color: #D4B27C; }
        .flow-card-name {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 13px;
          line-height: 1.1;
          font-variation-settings: "WONK" 0, "SOFT" 40;
        }
        .flow-card-state {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px; height: 16px;
          color: currentColor;
        }
        .flow-card.is-active .flow-card-state { color: #D4B27C; }
        .flow-card.is-done .flow-card-state   { color: #7A8471; }
        .flow-card-spinner {
          width: 10px; height: 10px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          border-right-color: transparent;
          animation: runner-spin 0.9s linear infinite;
        }
        @keyframes runner-spin { to { transform: rotate(360deg); } }
        .flow-card-pending {
          color: rgba(184,148,95,0.5);
          font-size: 16px;
          line-height: 0;
        }

        /* ── Output-Card ───────────────────────────────────────── */
        .flow-cell-output {
          margin-left: 8px;
        }
        .flow-output {
          flex: 0 0 auto;
          min-width: 200px;
          background: rgba(15, 15, 15, 0.95);
          border: 1.5px solid rgba(212, 178, 124, 0.35);
          padding: 0.9rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          text-align: center;
          color: rgba(250,246,238,0.5);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.45s, background 0.45s, box-shadow 0.55s, color 0.45s;
          position: relative;
        }
        .flow-output.is-active {
          color: #FAF6EE;
          border-color: #FAF6EE;
          background: linear-gradient(180deg, rgba(212, 178, 124, 0.18), rgba(184, 148, 95, 0.08));
          transform: translateY(-8px) scale(1.02);
          box-shadow:
            0 18px 40px -10px rgba(212, 178, 124, 0.55),
            0 0 60px rgba(212, 178, 124, 0.35),
            inset 0 0 0 1px rgba(250, 246, 238, 0.3);
        }
        .flow-output.is-active::after {
          content: "";
          position: absolute;
          inset: -8px;
          border: 1px dashed rgba(250, 246, 238, 0.35);
          pointer-events: none;
          animation: flow-output-halo 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes flow-output-halo {
          from { opacity: 0; inset: 0; }
          to   { opacity: 1; inset: -8px; }
        }
        .flow-output-num {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          color: #D4B27C;
          font-weight: 600;
        }
        .flow-output.is-active .flow-output-num { color: #FAF6EE; }
        .flow-output-name {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 15px;
          line-height: 1.15;
          font-variation-settings: "WONK" 1, "SOFT" 70;
        }
        .flow-output-state {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          color: currentColor;
        }
        .flow-output.is-active .flow-output-state { color: #D4B27C; }
        .flow-output-pending { font-size: 14px; }

        /* ── Console-Log ───────────────────────────────────────── */
        .runner-console {
          margin-top: 1.5rem;
          background: #0A0A0A;
          border: 1px solid rgba(250,246,238,0.12);
          border-radius: 4px;
          overflow: hidden;
        }
        .runner-console-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(250,246,238,0.1);
        }
        .runner-console-dot { width: 10px; height: 10px; border-radius: 50%; opacity: 0.7; }
        .runner-console-dot-r { background: #FF5F56; }
        .runner-console-dot-y { background: #FFBD2E; }
        .runner-console-dot-g { background: #27C93F; }

        .runner-console-body {
          margin: 0;
          padding: 1rem 1.2rem;
          min-height: 9rem;
          max-height: 11rem;
          overflow: hidden;
          display: flex;
          flex-direction: column-reverse;
          gap: 0.25rem;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          line-height: 1.55;
          color: #D6D1C2;
        }
        .runner-console-line {
          display: block;
          opacity: 1;
          animation: runner-line-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes runner-line-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .runner-console-line:nth-child(1) { opacity: 1; }
        .runner-console-line:nth-child(2) { opacity: 0.75; }
        .runner-console-line:nth-child(3) { opacity: 0.5; }
        .runner-console-line:nth-child(4) { opacity: 0.3; }
        .runner-console-line:nth-child(n+5) { opacity: 0.18; }

        .runner-console-line-muted  { color: rgba(250,246,238,0.4); }
        .runner-console-line-report { color: #D4B27C; }
        .runner-console-line-report .runner-console-pid { color: #D4B27C; }

        .runner-console-ts    { color: #7A8471; }
        .runner-console-pid   { color: #B8945F; }
        .runner-console-arrow { color: #D4B27C; }

        @media (prefers-reduced-motion: reduce) {
          .runner-spotlight,
          .runner-spot-num,
          .runner-spot-name,
          .runner-spot-role,
          .runner-spot-punch,
          .runner-console-line,
          .flow-output.is-active::after { animation: none !important; }
          .flow-card-spinner { animation: none; border-right-color: currentColor; }
          .flow-edge line { transition: none; }
        }
      `}</style>
    </section>
  );
}
