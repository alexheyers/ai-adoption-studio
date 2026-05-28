/**
 * SystemArchitecture — animiertes SVG-Diagramm der echten Pipeline.
 *
 * Pfad eines Datensatzes: Upload → Analyse-Agent → Voice (Ada) → Orchestrator
 *   → 8 SDK-Spezialisten (Reporter als letzter) → Report + Excel + PDF.
 * Side-Feeder: Knowledge-Tool gibt branchen-/DSGVO-Kontext in den Orchestrator.
 *
 * Pure SVG, pure CSS-Keyframes — kein JS-State.
 * 12s-Loop, Stages pulsen nacheinander auf; Pfade zeichnen sich via
 * stroke-dashoffset ein; ein Daten-Token wandert die Hauptachse entlang.
 * Stage-Progress-Indicator unten zeigt sichtbar, welcher Schritt gerade laeuft.
 * Respektiert prefers-reduced-motion (statischer Frame).
 */

const SPECIALISTS = [
  { n: "01", name: "Web-Research",       role: "Region · Markt · Quellen-Check" },
  { n: "02", name: "Dokumenten-Analyst", role: "GuV · Reports · Listen → JSON" },
  { n: "03", name: "Prozess-Auditor",    role: "wo Zeit verloren geht" },
  { n: "04", name: "Use-Case-Generator", role: "konkrete Ansatzpunkte" },
  { n: "05", name: "Tool-Empfehlung",    role: "passende Werkzeuge · DSGVO" },
  { n: "06", name: "Wirtschaftlichkeit", role: "Aufwand · Nutzen · Amortisation" },
  { n: "07", name: "Compliance-Check",   role: "DSGVO · AI-Act · Branche" },
  { n: "08", name: "Reporter",           role: "bündelt zu Report · Excel · PDF" },
];

const STAGES = ["Upload", "Analyse", "Voice", "Orchestrator", "8 Agenten", "Report"];

export function SystemArchitecture() {
  return (
    <section
      id="systemarchitektur"
      className="brutal-bg-dark border-b-2 border-ink scroll-reveal relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
        {/* ── Section-Head ────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-8 mb-14">
          <div className="col-span-12 lg:col-span-3">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">
              · 07d · Architektur, live
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-paper/45">
              Loopt alle 12 Sekunden
            </p>
            <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-paper/35 leading-relaxed">
              Kein Whitepaper-Slide — sondern echter Datenfluss aus{" "}
              <span className="text-gold/85">agent_patterns/</span>,{" "}
              <span className="text-gold/85">api/</span>,{" "}
              <span className="text-gold/85">agents/</span>.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <h2 className="h-brutal-md text-paper">
              So fließen die <em className="italic-accent text-gold">Daten</em>.
            </h2>
            <p className="mt-8 text-lg text-paper/70 leading-relaxed max-w-3xl">
              Sechs Stationen. Jede ist eine echte Datei im Repo — keine Symbolik. In der Mitte
              der <em className="italic-accent text-paper">Orchestrator</em>: liest{" "}
              <code className="font-mono text-[13px] text-gold/85">config.yaml</code>, dirigiert
              die Agenten der Reihe nach, reicht den Kontext weiter. Hinten fällt ein Report raus.
              Automatisch. Mit Belegen.
            </p>
          </div>
        </div>

        {/* ── Animiertes SVG-Diagramm ──────────────────────────── */}
        <div className="relative">
          <div className="arch-frame">
            {/* Hintergrund-Raster (sehr leise) */}
            <div className="arch-grid" aria-hidden="true" />

            <svg
              viewBox="0 0 1280 820"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Datenfluss durch das Studio — animiert"
              className="arch-svg"
            >
              <defs>
                <marker id="arr-burgundy" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 Z" fill="#6B2737" />
                </marker>
                <marker id="arr-gold" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 Z" fill="#B8945F" />
                </marker>
                <marker id="arr-paper" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 Z" fill="#FAF6EE" />
                </marker>
                <marker id="arr-sage" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 Z" fill="#7A8471" />
                </marker>

                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="orchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A1410" />
                  <stop offset="100%" stopColor="#0A0A0A" />
                </linearGradient>
              </defs>

              {/* ─────────────────── Stage 1 · Upload ─────────────────── */}
              <g className="arch-node arch-stage-1">
                <rect x="40" y="340" width="160" height="110" rx="6" />
                <text x="120" y="370" className="arch-eyebrow">STAGE 01</text>
                <text x="120" y="398" className="arch-title">Upload</text>
                <text x="120" y="422" className="arch-sub">Eckdaten + Dokumente</text>
                <text x="120" y="440" className="arch-tag">/onboarding</text>
              </g>
              <text x="120" y="478" className="arch-caption">Was reinkommt</text>

              <path d="M 200 395 L 268 395"
                className="arch-path arch-path-1"
                stroke="#6B2737" strokeWidth="2" fill="none" markerEnd="url(#arr-burgundy)" />
              <text x="234" y="385" className="arch-edge-label">Datei-Upload</text>

              {/* ─────────────────── Stage 2 · Analyse-Agent ─────────────────── */}
              <g className="arch-node arch-stage-2">
                <rect x="270" y="340" width="190" height="110" rx="6" />
                <text x="365" y="370" className="arch-eyebrow">STAGE 02</text>
                <text x="365" y="398" className="arch-title">Analyse-Agent</text>
                <text x="365" y="422" className="arch-sub">parst GuV · Reports · Listen</text>
                <text x="365" y="440" className="arch-tag">agents/document_analyst.py</text>
              </g>
              <text x="365" y="478" className="arch-caption">Was strukturiert wird</text>

              <path d="M 460 395 L 528 395"
                className="arch-path arch-path-2"
                stroke="#6B2737" strokeWidth="2" fill="none" markerEnd="url(#arr-burgundy)" />
              <text x="494" y="385" className="arch-edge-label">JSON-Recap</text>

              {/* ─────────────────── Stage 3 · Voice (Ada) ─────────────────── */}
              <g className="arch-node arch-stage-3">
                <rect x="530" y="340" width="210" height="110" rx="6" />
                <text x="635" y="370" className="arch-eyebrow">STAGE 03</text>
                <text x="635" y="398" className="arch-title">Voice — Ada</text>
                <text x="635" y="422" className="arch-sub">12-Domänen-Interview</text>
                <text x="635" y="440" className="arch-tag">ElevenLabs · WebRTC</text>
              </g>
              <text x="635" y="478" className="arch-caption">Wo das Gespräch entsteht</text>

              <path d="M 740 395 L 808 395"
                className="arch-path arch-path-3"
                stroke="#B8945F" strokeWidth="2" fill="none" markerEnd="url(#arr-gold)" />
              <text x="774" y="385" className="arch-edge-label">angereichert</text>

              {/* ─────────────────── Knowledge-Tool · Side-Feeder ─────────────────── */}
              <g className="arch-knowledge">
                <rect x="850" y="160" width="170" height="70" rx="6" />
                <text x="935" y="182" className="arch-eyebrow arch-eyebrow-sage">SIDE-FEEDER</text>
                <text x="935" y="206" className="arch-title arch-title-small">Knowledge-Tool</text>
                <text x="935" y="223" className="arch-sub">Branchen-Wissen · DSGVO</text>
              </g>
              <path d="M 935 230 L 935 320"
                className="arch-path arch-path-side"
                stroke="#7A8471" strokeWidth="1.5" fill="none" markerEnd="url(#arr-sage)" strokeDasharray="5 4" />
              <text x="950" y="280" className="arch-edge-label arch-edge-label-sage" textAnchor="start">read-only</text>

              {/* ─────────────────── Stage 4 · Orchestrator ─────────────────── */}
              <g className="arch-node arch-stage-4">
                <rect x="810" y="320" width="250" height="150" rx="6" fill="url(#orchGrad)" />
                <text x="935" y="350" className="arch-eyebrow arch-eyebrow-gold">STAGE 04 · ZENTRUM</text>
                <text x="935" y="384" className="arch-title arch-title-italic arch-title-large">Orchestrator</text>
                <text x="935" y="412" className="arch-sub arch-sub-gold">serieller Runner</text>
                <text x="935" y="432" className="arch-sub">config.yaml-getrieben</text>
                <text x="935" y="452" className="arch-tag">agent_patterns/core/orchestrator.py</text>
              </g>
              <text x="935" y="498" className="arch-caption">Wer dirigiert</text>

              {/* ─────────────────── Fan-Out zu 8 Spezialisten ─────────────────── */}
              {SPECIALISTS.map((s, i) => {
                const yTarget = 60 + i * 60;
                const xTarget = 1100;
                const xSource = 1060;
                const ySource = 395;
                const isReporter = i === SPECIALISTS.length - 1;
                return (
                  <g key={s.n}>
                    <path
                      d={`M ${xSource} ${ySource} C ${xSource + 30} ${ySource}, ${xTarget - 30} ${yTarget + 22}, ${xTarget} ${yTarget + 22}`}
                      className={`arch-path arch-path-fan arch-fan-${i + 1}`}
                      stroke={isReporter ? "#B8945F" : "#B8945F"}
                      strokeWidth={isReporter ? "2" : "1.3"}
                      opacity={isReporter ? "1" : "0.55"}
                      fill="none"
                    />
                  </g>
                );
              })}

              {/* ─────────────────── 8 Spezialisten-Karten ─────────────────── */}
              {SPECIALISTS.map((s, i) => (
                <g
                  key={s.n}
                  className={`arch-spec arch-spec-${i + 1} ${i === SPECIALISTS.length - 1 ? "arch-spec-reporter" : ""}`}
                  transform={`translate(1100, ${60 + i * 60})`}
                >
                  <rect x="0" y="0" width="180" height="44" rx="4" />
                  <text x="12" y="20" className="arch-spec-num">{s.n}</text>
                  <text x="42" y="20" className="arch-spec-name">{s.name}</text>
                  <text x="42" y="36" className="arch-spec-role">{s.role}</text>
                </g>
              ))}
              <text x="1190" y="40" className="arch-caption">Wer was tut</text>

              {/* ─────────────────── Reporter (#08) → Report-Output ─────────────────── */}
              <path
                d="M 1190 580 C 1200 660, 900 700, 700 700 L 540 700"
                className="arch-path arch-path-return"
                stroke="#FAF6EE" strokeWidth="2" fill="none"
                markerEnd="url(#arr-paper)" strokeDasharray="6 4"
              />
              <text x="900" y="688" className="arch-edge-label arch-edge-label-paper">bundling · PDF · XLSX</text>

              {/* ─────────────────── Stage 6 · Report-Output ─────────────────── */}
              <g className="arch-node arch-stage-6">
                <rect x="280" y="650" width="260" height="110" rx="6" />
                <text x="410" y="680" className="arch-eyebrow arch-eyebrow-paper">STAGE 06 · AUSGABE</text>
                <text x="410" y="708" className="arch-title arch-title-paper">Report · Excel · PDF</text>
                <text x="410" y="732" className="arch-sub arch-sub-paper">automatisch generiert</text>
                <text x="410" y="750" className="arch-tag arch-tag-paper">/report/[id]</text>
              </g>
              <text x="410" y="788" className="arch-caption">Was rauskommt</text>

              {/* ─────────────────── Wanderndes Token ─────────────────── */}
              <circle r="7" className="arch-token" cx="0" cy="0" fill="#B8945F" filter="url(#glow)" />
              <circle r="3" className="arch-token-core" cx="0" cy="0" fill="#FAF6EE" />
            </svg>
          </div>

          {/* ── Stage-Progress-Indicator unter dem Diagramm ───────── */}
          <div className="mt-8 grid grid-cols-12 gap-x-4 items-center">
            <p className="col-span-12 md:col-span-2 font-mono text-[10px] tracking-eyebrow uppercase text-paper/55">
              Aktive Stufe
            </p>
            <div className="col-span-12 md:col-span-10 flex items-center gap-3 flex-wrap">
              {STAGES.map((label, i) => (
                <div key={label} className={`arch-step arch-step-${i + 1} flex items-center gap-2`}>
                  <span className="arch-step-dot" aria-hidden="true" />
                  <span className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/70">
                    0{i + 1} · {label}
                  </span>
                  {i < STAGES.length - 1 && <span className="text-paper/20 font-mono">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Legende */}
          <div className="mt-8 pt-6 border-t border-paper/15 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 font-mono text-[10px] tracking-eyebrow uppercase text-paper/55">
            <span className="flex items-center gap-2"><span className="inline-block w-4 h-[2px] bg-burgundy" /> Daten-Eingang</span>
            <span className="flex items-center gap-2"><span className="inline-block w-4 h-[2px] bg-gold" /> SDK-Steuerung</span>
            <span className="flex items-center gap-2"><span className="inline-block w-4 h-[2px]" style={{ background: "repeating-linear-gradient(90deg,#7A8471 0 4px, transparent 4px 8px)" }} /> Knowledge-Feeder</span>
            <span className="flex items-center gap-2"><span className="inline-block w-4 h-[2px]" style={{ background: "repeating-linear-gradient(90deg,#FAF6EE 0 4px, transparent 4px 8px)" }} /> Rückfluss · Bericht</span>
          </div>
        </div>
      </div>

      {/* ── Komponenten-lokale Styles ───────────────────────────── */}
      <style>{`
        .arch-frame {
          position: relative;
          background:
            radial-gradient(60% 50% at 70% 50%, rgba(184, 148, 95, 0.10), transparent 60%),
            radial-gradient(40% 40% at 20% 80%, rgba(107, 39, 55, 0.12), transparent 60%);
          padding: 2rem 1rem;
          border: 1px solid rgba(250, 246, 238, 0.10);
        }
        .arch-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(250,246,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,246,238,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
        }
        .arch-svg {
          width: 100%;
          height: auto;
          display: block;
          position: relative;
          z-index: 1;
        }

        /* ── Node-Styling ──────────────────────────────────────── */
        .arch-node rect {
          fill: #0F0F0F;
          stroke: #6B2737;
          stroke-width: 1.5;
          transition: stroke 0.4s, stroke-width 0.4s, filter 0.4s;
        }
        .arch-node.arch-stage-4 rect {
          stroke: #B8945F;
          stroke-width: 2;
        }
        .arch-node.arch-stage-6 rect {
          fill: #FAF6EE;
          stroke: #FAF6EE;
        }
        .arch-knowledge rect {
          fill: #0F0F0F;
          stroke: #7A8471;
          stroke-width: 1.5;
          stroke-dasharray: 3 3;
        }

        text { text-anchor: middle; }

        .arch-eyebrow {
          fill: #B8945F;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .arch-eyebrow-gold  { fill: #D4B27C; }
        .arch-eyebrow-paper { fill: #6B2737; }
        .arch-eyebrow-sage  { fill: #7A8471; }

        .arch-title {
          fill: #FAF6EE;
          font-family: var(--font-display), Georgia, serif;
          font-weight: 500;
          font-size: 22px;
        }
        .arch-title-small { font-size: 18px; }
        .arch-title-large { font-size: 28px; }
        .arch-title-italic {
          font-style: italic;
          font-variation-settings: "WONK" 1, "SOFT" 80;
          fill: #D4B27C;
        }
        .arch-title-paper { fill: #161616; }

        .arch-sub {
          fill: #C5C0B0;
          font-family: var(--font-sans), sans-serif;
          font-size: 12px;
        }
        .arch-sub-gold  { fill: #D4B27C; font-weight: 600; }
        .arch-sub-paper { fill: #6B2737; }

        .arch-tag {
          fill: #7D7872;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
        }
        .arch-tag-paper { fill: #6B2737; }

        .arch-caption {
          fill: #7D7872;
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .arch-edge-label {
          fill: #B8945F;
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .arch-edge-label-paper { fill: #FAF6EE; }
        .arch-edge-label-sage  { fill: #7A8471; }

        /* ── Spezialisten-Reihe ────────────────────────────────── */
        .arch-spec rect {
          fill: #1A1410;
          stroke: #B8945F;
          stroke-width: 1;
          opacity: 0.55;
          transition: opacity 0.45s, stroke-width 0.45s;
        }
        .arch-spec-reporter rect {
          stroke: #D4B27C;
          stroke-width: 1.5;
          opacity: 0.7;
        }
        .arch-spec text { text-anchor: start; }
        .arch-spec-num {
          fill: #B8945F;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .arch-spec-name {
          fill: #FAF6EE;
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 14px;
        }
        .arch-spec-role {
          fill: #8A857C;
          font-family: var(--font-sans), sans-serif;
          font-size: 10px;
        }

        /* ── Pfad-Setup (Draw-In) ──────────────────────────────── */
        .arch-path        { stroke-dasharray: 240; stroke-dashoffset: 240; }
        .arch-path-return { stroke-dasharray: 800; stroke-dashoffset: 800; }
        .arch-path-fan    { stroke-dasharray: 220; stroke-dashoffset: 220; }
        .arch-path-side   { stroke-dasharray: 120; stroke-dashoffset: 120; }

        /* ── Keyframes ─────────────────────────────────────────── */
        @keyframes archDraw   { from { stroke-dashoffset: 240; } to { stroke-dashoffset: 0; } }
        @keyframes archDrawL  { from { stroke-dashoffset: 800; } to { stroke-dashoffset: 0; } }
        @keyframes archDrawF  { from { stroke-dashoffset: 220; } to { stroke-dashoffset: 0; } }
        @keyframes archDrawS  { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
        @keyframes archActiveStroke {
          0%, 100% { stroke-width: 1.5; stroke: #6B2737; }
          50%      { stroke-width: 3;   stroke: #B8945F; }
        }
        @keyframes archActiveStrokeGold {
          0%, 100% { stroke-width: 2; }
          45%, 55% { stroke-width: 4; filter: drop-shadow(0 0 14px rgba(184,148,95,0.6)); }
        }
        @keyframes archActiveStrokeOutput {
          0%, 100% { stroke-width: 1.5; }
          50%      { stroke-width: 3;   filter: drop-shadow(0 0 14px rgba(250,246,238,0.45)); }
        }
        @keyframes archSpecActive {
          0%, 100% { opacity: 0.55; stroke-width: 1; }
          50%      { opacity: 1;    stroke-width: 2; }
        }
        @keyframes archSpecActiveReporter {
          0%, 100% { opacity: 0.7; stroke-width: 1.5; }
          50%      { opacity: 1;   stroke-width: 2.5; filter: drop-shadow(0 0 10px rgba(212,178,124,0.4)); }
        }

        /* ── 12-Sekunden-Loop · Stage-Stagger ──────────────────── */
        .arch-stage-1 rect { animation: archActiveStroke 12s ease-in-out infinite; animation-delay: 0s; }
        .arch-path-1       { animation: archDraw 12s ease-in-out infinite; animation-delay: 0.5s; }

        .arch-stage-2 rect { animation: archActiveStroke 12s ease-in-out infinite; animation-delay: 1.4s; }
        .arch-path-2       { animation: archDraw 12s ease-in-out infinite; animation-delay: 1.9s; }

        .arch-stage-3 rect { animation: archActiveStroke 12s ease-in-out infinite; animation-delay: 2.8s; }
        .arch-path-3       { animation: archDraw 12s ease-in-out infinite; animation-delay: 3.3s; }

        .arch-knowledge rect { animation: archActiveStroke 12s ease-in-out infinite; animation-delay: 3.6s; }
        .arch-path-side      { animation: archDrawS 12s ease-in-out infinite; animation-delay: 3.9s; }

        .arch-stage-4 rect { animation: archActiveStrokeGold 12s ease-in-out infinite; animation-delay: 4.2s; }

        /* Fan-Out · 8 Pfeile staggered (0.12s pro Specialist) */
        ${SPECIALISTS.map((_, i) => `
        .arch-fan-${i + 1}     { animation: archDrawF 12s ease-in-out infinite; animation-delay: ${5.0 + i * 0.12}s; }
        .arch-spec-${i + 1} rect { animation: ${i === 7 ? "archSpecActiveReporter" : "archSpecActive"} 12s ease-in-out infinite; animation-delay: ${5.4 + i * 0.12}s; }
        `).join("")}

        .arch-path-return  { animation: archDrawL 12s ease-in-out infinite; animation-delay: 7.2s; }
        .arch-stage-6 rect { animation: archActiveStrokeOutput 12s ease-in-out infinite; animation-delay: 8.4s; }

        /* ── Wanderndes Token entlang Hauptachse ───────────────── */
        .arch-token, .arch-token-core {
          offset-path: path("M 120 395 L 365 395 L 635 395 L 935 395 L 1190 395 L 1190 580 L 410 700");
          offset-rotate: 0deg;
          animation: archTokenPath 12s linear infinite;
        }
        .arch-token-core { animation-delay: 0.05s; }
        @keyframes archTokenPath {
          0%   { offset-distance: 0%;   opacity: 0; }
          3%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }

        /* ── Stage-Progress-Indicator unten ───────────────────── */
        .arch-step-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(184, 148, 95, 0.25);
          transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        ${STAGES.map((_, i) => `
        .arch-step-${i + 1} .arch-step-dot { animation: archStepDot 12s ease-in-out infinite; animation-delay: ${i * 2.0}s; }
        `).join("")}
        @keyframes archStepDot {
          0%, 100% { background: rgba(184,148,95,0.25); transform: scale(1); box-shadow: none; }
          15%, 25% { background: #B8945F; transform: scale(1.6); box-shadow: 0 0 10px rgba(184,148,95,0.7); }
          40%      { background: rgba(184,148,95,0.5); transform: scale(1); box-shadow: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .arch-path,
          .arch-path-return,
          .arch-path-fan,
          .arch-path-side { stroke-dashoffset: 0; animation: none !important; }
          .arch-node rect,
          .arch-knowledge rect,
          .arch-spec rect { animation: none !important; opacity: 1; }
          .arch-spec rect { opacity: 0.85; }
          .arch-token, .arch-token-core { display: none; }
          .arch-step-dot { animation: none !important; background: rgba(184,148,95,0.5); }
        }

        /* Mobile · Diagramm horizontal scrollbar machen statt zerquetschen */
        @media (max-width: 900px) {
          .arch-frame { overflow-x: auto; padding: 1.25rem 0.5rem; }
          .arch-svg { width: 1280px; min-width: 1280px; }
        }
      `}</style>
    </section>
  );
}
