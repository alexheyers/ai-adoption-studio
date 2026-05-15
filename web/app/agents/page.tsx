"use client";

import Link from "next/link";
import { AgentPipelineDiagram } from "@/components/AgentPipelineDiagram";
import { EditorialHeader } from "@/components/Layout";

const AGENTS = [
  {
    id: "web-research",
    order: 0,
    name: "Web-Research-Agent",
    role: "Vor-Recherche",
    when: "Vor dem Voice-Interview (Architektur 2.1)",
    purpose: "Sucht öffentliche Informationen über die Firma + Stadt/Region-Benchmarks, damit Ada das Gespräch mit Kontext beginnen kann.",
    inputs: ["Firmenname, Sub-Segment, Region (aus Onboarding)"],
    outputs: ["company_findings (Reviews, Social Media, Presse, Eigentümer)", "region_benchmarks (Auslastung, Preise, Wettbewerber, Förderprogramme)", "sources[] (Quellenliste mit URLs)"],
    tech: "Anthropic Server-Side Web-Search via web_search_20250305-Tool, max 6 Suchen pro Run",
    file: "agents/web_research.py",
    status: "Live · 50 Quellen im letzten Smoke-Test",
    mvp: "voll",
  },
  {
    id: "process-auditor",
    order: 1,
    name: "Process-Auditor",
    role: "Prozess-Identifikation",
    when: "Erster Agent im Multi-Agent-Run nach Voice-Interview",
    purpose: "Identifiziert die zeitfressenden Prozesse aus Briefing + Transcript. Bewertet Automatisierungs-Potenzial und schätzt Einsparungen.",
    inputs: ["Vollständiges Briefing inkl. Voice-Transcript, Doc-Summary, KPIs, Pain Points"],
    outputs: ["processes[] mit name, description, current_time_hours_per_week, automation_potential (high/medium/low), primary_pain, estimated_savings_eur_year", "summary"],
    tech: "Claude Sonnet 4.6 · JSON-Response · 8192 max_tokens",
    file: "agents/process_auditor.py",
    status: "Live · 5 Prozesse im letzten Smoke-Test",
    mvp: "voll",
  },
  {
    id: "use-case-generator",
    order: 2,
    name: "Use-Case-Generator",
    role: "KI-Anwendungsfälle",
    when: "Nach Process-Auditor — übersetzt Prozesse in konkrete KI-Use-Cases",
    purpose: "Generiert KI-Anwendungsfälle pro Prozess. Markiert Quick Wins (<4 Wochen Umsetzung). Klassifiziert AI-Pattern (Chatbot, RAG, Agent, Vision etc.).",
    inputs: ["Briefing + Process-Auditor-Output"],
    outputs: ["use_cases[] mit name, description, target_process, ai_pattern, expected_impact, complexity, quick_win-Flag", "quick_wins_summary"],
    tech: "Claude Sonnet 4.6 · Branchen-Anker via System-Prompt (Hospitality-Patterns)",
    file: "agents/use_case_generator.py",
    status: "Live · 7 Use-Cases (3 Quick Wins) im letzten Smoke-Test",
    mvp: "voll",
  },
  {
    id: "tool-recommender",
    order: 3,
    name: "Tool-Recommender",
    role: "Stack-Vorschlag + Make/Buy",
    when: "Parallel oder nach Use-Case-Generator",
    purpose: "Empfiehlt pro Use-Case konkretes Tool + Alternativen, schätzt Monatskosten und Setup-Komplexität, beschreibt Integration mit bestehendem Stack.",
    inputs: ["Briefing (current_tools!) + Use-Case-Output"],
    outputs: ["recommendations[] mit use_case_name, primary_tool, alternative_tools[], monthly_cost_eur, setup_complexity, why_this_tool, integration_with_existing", "stack_summary"],
    tech: "Claude Sonnet 4.6 · Hospitality-Tool-Datenbank im System-Prompt (Mews, Apaleo, Apetito, Tiramizoo, Customer Alliance etc.)",
    file: "agents/tool_recommender.py",
    status: "Live · 7 Tool-Empfehlungen im letzten Smoke-Test",
    mvp: "voll",
  },
  {
    id: "roi-calculator",
    order: 4,
    name: "ROI-Calculator",
    role: "Geld-Rechnung",
    when: "Nach Tools — braucht Kosten + Use-Cases als Input",
    purpose: "Berechnet pro Use-Case: Investment Y1, Savings Y1, Payback-Monate, 3-Jahres-ROI. Aggregiert zur Gesamt-Rechnung.",
    inputs: ["Briefing + Audit + Use-Cases + Tools"],
    outputs: ["line_items[] pro Use-Case", "total_investment_eur, total_savings_eur_year_1, total_savings_eur_3_years, total_payback_months, summary"],
    tech: "Claude Sonnet 4.6 · Mathematische Plausibilität wird im Prompt erzwungen ('Zahlen müssen sich addieren')",
    file: "agents/roi_calculator.py",
    status: "Live · 72k Invest, 248k 3J-Savings, 12,2 Mo Payback im letzten Smoke-Test",
    mvp: "voll",
  },
  {
    id: "compliance-checker",
    order: 5,
    name: "Compliance-Checker",
    role: "DSGVO + AI-Act + Branchen-Recht",
    when: "Nach Use-Cases — prüft jeden Vorschlag auf Compliance",
    purpose: "Pro Use-Case: DSGVO-Relevanz (personenbezogene Daten?), EU AI-Act Risikoklasse (minimal/limited/high/unacceptable), Branchen-Hinweise (Gastrecht, Steuerpflichten, HACCP), Mitigationen. KEINE Rechtsberatung — strukturierte Hinweise mit Disclaimer.",
    inputs: ["Briefing + Use-Cases + Tool-Empfehlungen"],
    outputs: ["flags[] mit use_case_name, dsgvo_relevant, dsgvo_reason, ai_act_risk_class, industry_specific[], mitigations[]", "general_advice", "disclaimer"],
    tech: "Claude Sonnet 4.6 · Strikte Längenbegrenzung pro Feld, damit JSON nicht abgeschnitten wird",
    file: "agents/compliance_checker.py",
    status: "Live · 7 Flags (5 mit DSGVO/AI-Act-Aufmerksamkeit) im letzten Smoke-Test",
    mvp: "stub (MVP) → voll (P5)",
  },
  {
    id: "roadmap-generator",
    order: 6,
    name: "Roadmap-Generator",
    role: "3-Phasen-Plan",
    when: "Vorletzter Agent — braucht alle vorherigen Outputs",
    purpose: "Baut 3-Phasen-Roadmap (0-3 Mo Quick-Wins → 3-6 Mo Foundation → 6-12 Mo Scale). Pro Phase: Use-Cases, Tools, Aufwand in Personentagen, Dependencies, Outcomes.",
    inputs: ["Briefing + Use-Cases + Tools + ROI"],
    outputs: ["phases[] (3 Stück) mit phase_number, name, duration_months, use_cases, required_tools, estimated_effort_pt, dependencies, expected_outcomes", "critical_path", "total_effort_pt"],
    tech: "Claude Sonnet 4.6 · Quick-Win-Flag wird respektiert (Phase 1)",
    file: "agents/roadmap_generator.py",
    status: "Live · 3 Phasen, 72 PT total im letzten Smoke-Test",
    mvp: "stub (MVP) → voll (P5)",
  },
  {
    id: "reporter",
    order: 7,
    name: "Reporter",
    role: "Executive Summary + Aggregation",
    when: "Letzter Agent — aggregiert alle Outputs",
    purpose: "Schreibt eine Executive Summary in 3–4 Sätzen, die ein CEO in 30 Sek liest. Tonalität: konkret, ohne Buzzwords, mit klarer 'Nein zu X'-Aussage wenn nötig.",
    inputs: ["Alle vorherigen Agent-Outputs"],
    outputs: ["FullReport mit executive_summary + alle Sub-Reports geschachtelt"],
    tech: "Claude Sonnet 4.6 · Direkter Ton im System-Prompt erzwungen ('Sprich den CEO direkt an, keine Floskeln')",
    file: "agents/reporter.py",
    status: "Live · Demo-Output: 'Ja, investieren — aber mit klarer Priorität...'",
    mvp: "funktional (MVP) → voll (P5)",
  },
];

const POST_AGENTS = [
  {
    name: "Excel-Generator",
    purpose: "Generiert 6 Sheets (Executive Summary, ROI, Use-Cases, Tools, Roadmap, Compliance) als .xlsx",
    file: "outputs/excel_generator.py",
    tech: "openpyxl mit Branding-Farben (Navy/Teal/Cream/Amber)",
  },
  {
    name: "PPTX-Generator",
    purpose: "Pitch-Deck mit ~9 Slides (Title, Summary, KPIs, Audit, Use-Cases, Tools, Roadmap, Compliance, Next-Steps)",
    file: "outputs/pptx_generator.py",
    tech: "python-pptx · 16:9 · einheitliches Design-System",
  },
  {
    name: "PDF-Generator",
    purpose: "Voll-Report als mehrseitiger PDF (Cover + alle Sektionen)",
    file: "outputs/pdf_generator.py",
    tech: "WeasyPrint (HTML/CSS → PDF, A4)",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <EditorialHeader />

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <p className="text-sm uppercase tracking-widest text-teal mb-3">Agents</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 max-w-3xl">
          8 spezialisierte KI-Agents + 3 Output-Generatoren
        </h1>
        <p className="text-lg text-ink/70 max-w-3xl leading-relaxed">
          Jeder Agent ist ein Mini-Senior-Berater mit klarem Job. Sequenziell + parallel orchestriert.
          Kein Mega-Prompt, sondern eine Pipeline mit überprüfbaren Zwischen-Outputs.
        </p>
        <div className="mt-6 grid md:grid-cols-4 gap-3 text-sm">
          <Stat label="Multi-Agents" value="8" />
          <Stat label="Output-Generatoren" value="3" />
          <Stat label="Voll im MVP" value="5" />
          <Stat label="Stub im MVP" value="3" />
        </div>
      </section>

      {/* Pipeline-Visualisierung — Inline-SVG-Diagramm */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <AgentPipelineDiagram />
      </section>

      {/* Agent-Details */}
      <div className="mx-auto max-w-7xl px-6 pb-16 space-y-6">
        {AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>

      {/* Post-Pipeline Output-Generatoren */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-3">Nach der Pipeline: Output-Generatoren</h2>
        <p className="text-base text-ink/65 mb-6 max-w-3xl">
          Sobald der Reporter aggregiert hat, generieren drei Module die Deliverables — die der Kunde am Ende herunterlädt.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {POST_AGENTS.map((p) => (
            <div key={p.name} className="card">
              <p className="text-xs uppercase tracking-widest text-teal mb-2">Output</p>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-ink/70 mt-2 leading-relaxed">{p.purpose}</p>
              <p className="text-xs text-ink/50 mt-3"><code>{p.file}</code></p>
              <p className="text-xs text-ink/50 mt-1">{p.tech}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MVP-Status */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-6">MVP-Status</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-ink/60 border-b border-ink/10">
              <tr>
                <th className="py-3 pr-4">Agent</th>
                <th className="py-3 pr-4">MVP-Stufe</th>
                <th className="py-3 pr-4">Datei</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {AGENTS.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 pr-4 font-medium">{a.name}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${a.mvp === "voll" ? "bg-green-100 text-green-800" : "bg-amber/10 text-amber-700"}`}>
                      {a.mvp}
                    </span>
                  </td>
                  <td className="py-3 pr-4"><code className="text-xs">{a.file}</code></td>
                  <td className="py-3 pr-4 text-ink/70 text-xs">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-ink/50 flex justify-between">
          <span>AI-Adoption-Studio · Agents · v0.1 (MVP)</span>
          <span>2026-05-11</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center py-4">
      <p className="text-3xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink/55 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function AgentCard({ agent }: { agent: typeof AGENTS[number] }) {
  return (
    <section id={agent.id} className="card scroll-mt-24">
      <div className="grid md:grid-cols-[80px_1fr] gap-5">
        <div>
          <div className="text-3xl text-teal font-semibold">{String(agent.order).padStart(2, "0")}</div>
        </div>
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-2xl font-semibold tracking-tight">{agent.name}</h2>
            <span className="text-xs uppercase tracking-widest text-teal">{agent.role}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${agent.mvp === "voll" ? "bg-green-100 text-green-800" : "bg-amber/10 text-amber-700"}`}>
              {agent.mvp}
            </span>
          </div>
          <p className="text-base text-ink/70 mt-3">{agent.purpose}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-teal mb-1">Wann</p>
              <p className="text-sm text-ink/80">{agent.when}</p>

              <p className="text-xs uppercase tracking-widest text-teal mt-4 mb-1">Inputs</p>
              <ul className="text-sm text-ink/80 space-y-0.5">
                {agent.inputs.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-teal mb-1">Outputs</p>
              <ul className="text-sm text-ink/80 space-y-0.5">
                {agent.outputs.map((o) => <li key={o}>· {o}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-ink/5 px-4 py-3 grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Tech</p>
              <p className="text-xs text-ink/70">{agent.tech}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Datei</p>
              <code className="text-xs text-ink/70">{agent.file}</code>
              <p className="text-xs text-ink/60 mt-1">{agent.status}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
