"use client";

/**
 * Editorial Inline-SVG-Diagramm der 8-Agent-Pipeline.
 * Farben aus Tailwind-Theme (Burgundy, Gold, Off-Black, Cream).
 * Passend zum Editorial × Quiet Luxury Design-System.
 */
export function AgentPipelineDiagram() {
  return (
    <div className="bg-paper2 border border-ink/15 p-8 md:p-12 overflow-x-auto">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mb-1">
        Fig. 3 · Pipeline-Flussdiagramm
      </p>
      <p className="font-display text-2xl text-ink mb-8">
        Acht Agents, eine Sequenz.
      </p>

      <svg
        viewBox="0 0 1200 760"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto min-w-[860px]"
      >
        <defs>
          <marker id="arrowInk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#161616" />
          </marker>
          <marker id="arrowBurgundy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6B2737" />
          </marker>
          <marker id="arrowGold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#B8945F" />
          </marker>
        </defs>

        {/* ── Zonen-Hintergründe ─────────────────────────────────── */}
        <g>
          {/* Input-Zone */}
          <rect x="20" y="40" width="220" height="680" fill="#F2EBDD" stroke="#C9C1B0" strokeWidth="1" />
          <text x="40" y="68" className="font-mono" fontSize="11" fill="#6B2737" letterSpacing="2.4">INPUT</text>

          {/* Agent-Zone */}
          <rect x="280" y="40" width="640" height="680" fill="#FAF6EE" stroke="#C9C1B0" strokeWidth="1" />
          <text x="300" y="68" className="font-mono" fontSize="11" fill="#6B2737" letterSpacing="2.4">AGENTS · CLAUDE SONNET 4.6</text>

          {/* Output-Zone */}
          <rect x="960" y="40" width="220" height="680" fill="#F2EBDD" stroke="#C9C1B0" strokeWidth="1" />
          <text x="980" y="68" className="font-mono" fontSize="11" fill="#6B2737" letterSpacing="2.4">OUTPUT</text>
        </g>

        {/* ── INPUTS ─────────────────────────────────── */}
        <InputBox x={40} y={110} title="Onboarding" detail="Profil + Pains" />
        <InputBox x={40} y={220} title="Dokumente" detail="PDF · Excel · DOCX" />
        <InputBox x={40} y={330} title="Voice mit Ada" detail="30 Min · Transcript" />

        {/* ── AGENT 00 · Web-Research ─────────────────────────────────── */}
        <AgentBox x={300} y={110} num="00" name="Web-Research" detail="Firma + Region-Benchmarks" />
        <Arrow x1={240} y1={143} x2={300} y2={143} />

        {/* ── AGENT 01 · Process-Auditor ─────────────────────────────────── */}
        <AgentBox x={300} y={210} num="01" name="Process-Auditor" detail="Prozesse + Automation-Potenzial" />
        <Arrow x1={385} y1={183} x2={385} y2={210} />

        {/* ── AGENT 02 · Use-Case-Generator ─────────────────────────────────── */}
        <AgentBox x={300} y={310} num="02" name="Use-Case-Generator" detail="Anwendungsfälle · Quick-Wins" />
        <Arrow x1={385} y1={283} x2={385} y2={310} />

        {/* ── AGENT 03 · Tool-Recommender ─────────────────────────────────── */}
        <AgentBox x={510} y={310} num="03" name="Tool-Recommender" detail="Stack · Make/Buy · Kosten" />
        <Arrow x1={470} y1={343} x2={510} y2={343} />

        {/* ── AGENT 04 · ROI-Calculator ─────────────────────────────────── */}
        <AgentBox x={720} y={310} num="04" name="ROI-Calculator" detail="Invest · Savings · Payback" />
        <Arrow x1={680} y1={343} x2={720} y2={343} />

        {/* ── AGENT 05 · Compliance-Checker ─────────────────────────────────── */}
        <AgentBox x={300} y={460} num="05" name="Compliance-Checker" detail="DSGVO + EU AI-Act" />
        <Arrow x1={385} y1={383} x2={385} y2={460} />

        {/* ── AGENT 06 · Roadmap-Generator ─────────────────────────────────── */}
        <AgentBox x={720} y={460} num="06" name="Roadmap-Generator" detail="3-Phasen · 12 Monate" />
        <Arrow x1={805} y1={383} x2={805} y2={460} />

        {/* ── AGENT 07 · Reporter ─────────────────────────────────── */}
        <AgentBox x={510} y={600} num="07" name="Reporter" detail="Executive Summary" highlight />
        <Arrow x1={385} y1={533} x2={510} y2={620} burgundy />
        <Arrow x1={805} y1={533} x2={680} y2={620} burgundy />

        {/* ── OUTPUTS ─────────────────────────────────── */}
        <OutputBox x={980} y={140} title="PPTX" detail="Pitch-Deck" />
        <OutputBox x={980} y={260} title="Excel" detail="ROI-Modell" />
        <OutputBox x={980} y={380} title="PDF" detail="Voll-Report" />

        {/* Bündel-Pfeil von Reporter zu Outputs */}
        <path
          d="M 680 630 Q 850 630 970 200"
          stroke="#B8945F"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowGold)"
        />
        <path
          d="M 680 633 Q 870 633 970 320"
          stroke="#B8945F"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowGold)"
        />
        <path
          d="M 680 636 Q 850 636 970 440"
          stroke="#B8945F"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowGold)"
        />

        {/* ── Storage-Footer ─────────────────────────────────── */}
        <rect x="300" y="690" width="620" height="40" fill="#161616" />
        <text x="610" y="715" textAnchor="middle" className="font-mono" fontSize="11" fill="#FAF6EE" letterSpacing="1.8">
          SUPABASE POSTGRES · run_results (JSONB) + STORAGE BUCKET
        </text>
        <line x1="510" y1="673" x2="510" y2="690" stroke="#161616" strokeWidth="1" strokeDasharray="4 2" />
      </svg>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
        <LegendItem swatch="#161616" label="Sequenz" />
        <LegendItem swatch="#6B2737" label="Aggregation" />
        <LegendItem swatch="#B8945F" label="Deliverable" />
      </div>
    </div>
  );
}

function InputBox({ x, y, title, detail }: { x: number; y: number; title: string; detail: string }) {
  return (
    <g>
      <rect x={x} y={y} width="180" height="66" fill="#FAF6EE" stroke="#161616" strokeWidth="1.5" />
      <text x={x + 14} y={y + 28} className="font-display" fontSize="16" fill="#161616" fontWeight="500">{title}</text>
      <text x={x + 14} y={y + 50} fontSize="11" fill="#3A3735">{detail}</text>
    </g>
  );
}

function AgentBox({ x, y, num, name, detail, highlight = false }: { x: number; y: number; num: string; name: string; detail: string; highlight?: boolean }) {
  const bg = highlight ? "#6B2737" : "#FAF6EE";
  const stroke = highlight ? "#6B2737" : "#161616";
  const numColor = highlight ? "#B8945F" : "#6B2737";
  const nameColor = highlight ? "#FAF6EE" : "#161616";
  const detailColor = highlight ? "#F2EBDD" : "#3A3735";
  return (
    <g>
      <rect x={x} y={y} width="170" height="74" fill={bg} stroke={stroke} strokeWidth="1.5" />
      <text x={x + 14} y={y + 22} className="font-mono" fontSize="10" fill={numColor} letterSpacing="2">{num}</text>
      <text x={x + 14} y={y + 44} className="font-display" fontSize="15" fill={nameColor} fontWeight="500">{name}</text>
      <text x={x + 14} y={y + 62} fontSize="10.5" fill={detailColor}>{detail}</text>
    </g>
  );
}

function OutputBox({ x, y, title, detail }: { x: number; y: number; title: string; detail: string }) {
  return (
    <g>
      <rect x={x} y={y} width="180" height="80" fill="#FAF6EE" stroke="#B8945F" strokeWidth="1.5" />
      <text x={x + 14} y={y + 30} className="font-display" fontSize="18" fill="#B8945F" fontWeight="500">{title}</text>
      <text x={x + 14} y={y + 56} fontSize="11" fill="#3A3735">{detail}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, burgundy = false }: { x1: number; y1: number; x2: number; y2: number; burgundy?: boolean }) {
  const color = burgundy ? "#6B2737" : "#161616";
  const marker = burgundy ? "url(#arrowBurgundy)" : "url(#arrowInk)";
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" markerEnd={marker} />
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block w-3 h-0.5" style={{ background: swatch }} />
      {label}
    </span>
  );
}
