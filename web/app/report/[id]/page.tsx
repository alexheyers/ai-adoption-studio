"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import { api } from "@/lib/api";

/**
 * Report-Page · Editorial Premium-Beratungs-Output.
 * Layout: Sticky-Sidebar-Nav links + Editorial-Spread rechts.
 * Cover · Executive Summary · Pre-Audit · Daten-Analyse · Audit · Use-Cases ·
 * Tools · ROI · Roadmap · Compliance · Deliverables · Disclaimer.
 *
 * Print-Optimiert (Cmd+P → PDF).
 */

const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "executive", label: "Executive Summary" },
  { id: "pre-audit", label: "Pre-Audit-Hypothesen" },
  { id: "data", label: "Daten-Analyse" },
  { id: "audit", label: "Prozess-Audit" },
  { id: "use-cases", label: "Use-Cases" },
  { id: "anti", label: "Nicht tun" },
  { id: "tools", label: "Tool-Stack" },
  { id: "roi", label: "ROI-Modell" },
  { id: "roadmap", label: "Roadmap" },
  { id: "compliance", label: "Compliance" },
  { id: "deliverables", label: "Downloads" },
];

const AGENT_LABELS: Record<string, string> = {
  web_research: "Web-Research",
  pre_audit: "Pre-Audit-Analyst",
  document_analysis: "Document-Analyst",
  process_auditor: "Process-Auditor",
  use_case_generator: "Use-Case-Generator",
  tool_recommender: "Tool-Recommender",
  roi_calculator: "ROI-Calculator",
  compliance_checker: "Compliance-Checker",
  roadmap_generator: "Roadmap-Generator",
  full_report: "Reporter",
};

export default function ReportPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ run: any; results: Record<string, any> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("cover");

  useEffect(() => {
    let stopped = false;
    async function tick() {
      try {
        const res = await api.getRun(params.id);
        if (!stopped) setData(res);
        if (!stopped && res.run.status !== "completed" && res.run.status !== "failed") {
          setTimeout(tick, 2500);
        }
      } catch (err: any) {
        if (!stopped) setError(err.message);
      }
    }
    tick();
    return () => { stopped = true; };
  }, [params.id]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveSection(e.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [data]);

  if (error) {
    return (
      <>
        <EditorialHeader />
        <main className="mx-auto max-w-3xl px-8 py-24">
          <p className="eyebrow text-burgundy">Fehler</p>
          <p className="mt-4 text-ink2">{error}</p>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <EditorialHeader />
        <main className="mx-auto max-w-3xl px-8 py-24">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 animate-pulse">Lade Run …</p>
        </main>
      </>
    );
  }

  const { run, results } = data;
  const fr = results.full_report;
  const isCompleted = run.status === "completed";
  const isFailed = run.status === "failed";

  // Wenn Pipeline noch läuft: Skeleton mit Live-Status
  if (!isCompleted && !isFailed) {
    return <PipelineProgress run={run} results={results} />;
  }

  if (isFailed) {
    return (
      <>
        <EditorialHeader />
        <main className="mx-auto max-w-3xl px-8 py-24">
          <p className="eyebrow text-burgundy">Pipeline · Fehler</p>
          <h1 className="mt-4 font-display text-3xl">{run.current_step}</h1>
          <p className="mt-6 text-ink2 leading-relaxed">{run.error || "Ein Agent ist abgestürzt — siehe Server-Log."}</p>
        </main>
      </>
    );
  }

  return (
    <div className="bg-paper print:bg-white">
      <PrintStyles />
      <EditorialHeader />

      <div className="mx-auto max-w-[1500px] grid grid-cols-12 gap-x-6 px-6 lg:px-10">
        {/* ── Sticky Sidebar-Nav ─────────────────────────────────── */}
        <aside className="hidden lg:block col-span-2 print:hidden">
          <nav className="sticky top-20 pt-16 pb-12">
            <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3 mb-6">
              Bericht-Navigation
            </p>
            <ol className="space-y-2.5">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`flex items-baseline gap-2 text-xs leading-tight transition-colors ${
                      activeSection === s.id ? "text-burgundy font-medium" : "text-ink3 hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[9px] tracking-eyebrow w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* ── Main-Content ─────────────────────────────────── */}
        <main className="col-span-12 lg:col-span-10 pt-12 pb-24">
          <CoverSection runId={params.id} run={run} fr={fr} />
          <ExecutiveSection fr={fr} />
          <PreAuditSection fr={fr} />
          <DataAnalysisSection fr={fr} />
          <AuditSection fr={fr} />
          <UseCasesSection fr={fr} />
          <AntiUseCasesSection fr={fr} />
          <ToolsSection fr={fr} />
          <ROISection fr={fr} />
          <RoadmapSection fr={fr} />
          <ComplianceSection fr={fr} />
          <DeliverablesSection runId={params.id} />
          <DisclaimerSection />
        </main>
      </div>

      <EditorialFooter />
    </div>
  );
}

/* ═══════════════ PIPELINE PROGRESS ═══════════════ */

function PipelineProgress({ run, results }: { run: any; results: Record<string, any> }) {
  const agents = [
    "web_research", "pre_audit", "document_analysis", "process_auditor",
    "use_case_generator", "tool_recommender", "roi_calculator",
    "compliance_checker", "roadmap_generator", "full_report",
  ];
  return (
    <>
      <EditorialHeader />
      <main className="mx-auto max-w-[1100px] px-8 py-16">
        <p className="eyebrow">Multi-Agent-Pipeline · läuft</p>
        <h1 className="mt-4 font-display text-display-md text-ink leading-tight">
          Ihre Beratung wird gerade <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>geschrieben.</em>
        </h1>
        <p className="mt-6 text-ink2 leading-relaxed max-w-2xl">
          Aktueller Schritt: <code className="text-burgundy">{run.current_step}</code> · 9 Agents laufen sequenziell · Gesamt-Dauer ~3–6 Minuten · Auto-Refresh alle 2,5 Sek.
        </p>

        <ol className="mt-12 border-t border-ink/15 divide-y divide-ink/10">
          {agents.map((a, i) => {
            const isDone = a in results;
            const isCurrent = run.current_step === a;
            return (
              <li key={a} className="flex items-baseline gap-6 py-4">
                <span className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`flex-1 font-display text-lg ${isDone ? "text-ink" : isCurrent ? "text-burgundy" : "text-ink3"}`}>
                  {AGENT_LABELS[a] || a}
                </span>
                <span className="font-mono text-[10px] tracking-eyebrow uppercase">
                  {isDone ? <span className="text-burgundy">✓ fertig</span> : isCurrent ? <span className="text-gold animate-pulse">läuft …</span> : <span className="text-ink3">wartet</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}

/* ═══════════════ SECTIONS ═══════════════ */

function CoverSection({ runId, run, fr }: any) {
  const date = new Date(run.completed_at || run.created_at).toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" });
  return (
    <section id="cover" className="border-b border-ink/15 pb-20 scroll-mt-24">
      <div className="flex items-baseline justify-between font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mb-10">
        <span>Multi-Agent-Analyse · vol. 1</span>
        <span>{date}</span>
        <span>Run-ID: {runId.slice(0, 8)}…</span>
      </div>

      <p className="eyebrow">Hospitality-KI-Adoption · Beratungs-Bericht</p>
      <h1 className="mt-6 font-display text-display-xl text-ink leading-[0.95]"
          style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144' }}>
        {fr.company_name}
      </h1>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/15 border-y border-ink/15">
        <KpiTile label="Investment Y1" value={`${(fr.roi?.total_investment_eur || 0).toLocaleString("de-DE")}`} unit="€" />
        <KpiTile label="Savings Y1" value={`${(fr.roi?.total_savings_eur_year_1 || 0).toLocaleString("de-DE")}`} unit="€" accent />
        <KpiTile label="Savings 3 Jahre" value={`${(fr.roi?.total_savings_eur_3_years || 0).toLocaleString("de-DE")}`} unit="€" accent />
        <KpiTile label="Payback" value={`${fr.roi?.total_payback_months || "—"}`} unit="Monate" />
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-8 text-sm">
        <Meta label="Use-Cases identifiziert" value={`${fr.use_cases?.use_cases?.length || 0} · davon ${(fr.use_cases?.use_cases || []).filter((u: any) => u.quick_win).length} Quick Wins`} />
        <Meta label="Roadmap-Aufwand" value={`${fr.roadmap?.total_effort_pt || "—"} Personentage`} />
        <Meta label="Compliance-Flags" value={`${(fr.compliance?.flags || []).filter((f: any) => f.dsgvo_relevant || f.ai_act_risk_class !== "minimal").length} mit Aufmerksamkeitsbedarf`} />
      </div>
    </section>
  );
}

function ExecutiveSection({ fr }: any) {
  return (
    <section id="executive" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="01" label="Executive Summary" />
      <blockquote className="mt-10 pull-quote text-ink max-w-4xl">
        {fr.executive_summary}
      </blockquote>
      <p className="mt-8 font-mono text-[10px] tracking-eyebrow uppercase text-ink3 pl-[4.5rem]">
        Aus der Synthese des Reporter-Agents
      </p>
    </section>
  );
}

function PreAuditSection({ fr }: any) {
  const pa = fr.pre_audit;
  if (!pa || !pa.hypotheses?.length) return null;
  return (
    <section id="pre-audit" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="02" label="Pre-Audit-Hypothesen" subtitle="Die Working-Hypothesis vor dem Voice-Gespräch · Senior-Consultant-Methode" />

      {pa.overall_situation && (
        <div className="mt-10 max-w-3xl">
          <p className="eyebrow-ink">Gesamt-Einschätzung</p>
          <p className="mt-3 font-display text-2xl text-ink leading-snug"
             style={{ fontVariationSettings: '"SOFT" 50' }}>
            {pa.overall_situation}
          </p>
        </div>
      )}

      <ol className="mt-14 space-y-8">
        {pa.hypotheses.map((h: any, i: number) => (
          <HypothesisCard key={h.id || i} num={i + 1} h={h} />
        ))}
      </ol>

      {pa.data_gaps?.length > 0 && (
        <div className="mt-12 border-l-2 border-gold pl-6">
          <p className="eyebrow">Datenlücken vor Voice</p>
          <ul className="mt-4 space-y-2 text-sm text-ink2">
            {pa.data_gaps.map((g: string, i: number) => <li key={i}>· {g}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function HypothesisCard({ num, h }: { num: number; h: any }) {
  const confColors: Record<string, string> = { high: "bg-burgundy", medium: "bg-gold", low: "bg-ink3" };
  const confBars: Record<string, number> = { high: 3, medium: 2, low: 1 };
  return (
    <li className="grid grid-cols-12 gap-x-6 border-t border-ink/15 pt-6 break-inside-avoid">
      <div className="col-span-12 lg:col-span-2">
        <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">Hypothese · {String(num).padStart(2, "0")}</p>
        <div className="mt-3 flex items-center gap-1.5">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-5 ${i <= (confBars[h.confidence] || 0) ? confColors[h.confidence] || "bg-ink3" : "bg-ink/10"}`} />
          ))}
        </div>
        <p className="mt-2 font-mono text-[9px] tracking-eyebrow uppercase text-ink3">
          Confidence: <span className="text-ink">{h.confidence}</span>
        </p>
      </div>
      <div className="col-span-12 lg:col-span-10">
        <h3 className="font-display text-2xl text-ink leading-tight"
            style={{ fontVariationSettings: '"SOFT" 50' }}>
          {h.title}
        </h3>
        <p className="mt-3 text-ink2 leading-relaxed">{h.statement}</p>
        {h.evidence?.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow-ink">Evidenz</p>
            <ul className="mt-2 space-y-1 text-sm text-ink2">
              {h.evidence.map((e: string, i: number) => <li key={i} className="pl-3 border-l border-ink/15">{e}</li>)}
            </ul>
          </div>
        )}
        {h.benchmark_comparison && (
          <p className="mt-4 text-sm text-ink2 italic">
            <span className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy not-italic mr-2">vs Benchmark</span>
            {h.benchmark_comparison}
          </p>
        )}
        {h.push_back_question && (
          <div className="mt-5 bg-paper2 px-5 py-4 border-l-2 border-burgundy">
            <p className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy mb-1.5">Ada-Push-Back-Frage</p>
            <p className="font-display italic text-ink leading-snug"
               style={{ fontVariationSettings: '"WONK" 1' }}>
              „{h.push_back_question}"
            </p>
          </div>
        )}
        {h.quantification_formula && (
          <p className="mt-4 text-xs text-ink3 font-mono">
            Quantifizierung: <span className="text-ink">{h.quantification_formula}</span>
          </p>
        )}
      </div>
    </li>
  );
}

function DataAnalysisSection({ fr }: any) {
  const da = fr.document_analysis;
  if (!da) return null;
  return (
    <section id="data" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="03" label="Daten-Analyse" subtitle="Was die KI aus Ihren hochgeladenen Dokumenten gelesen hat" />

      <div className="mt-10 grid md:grid-cols-[1fr_240px] gap-8">
        <div>
          <p className="eyebrow-ink">Benchmark-Einordnung</p>
          <p className="mt-3 text-ink2 leading-relaxed text-lg">{da.benchmark_assessment}</p>
          {da.cross_validation && (
            <div className="mt-6">
              <p className="eyebrow-ink">Cross-Validation Voice ↔ Dokumente</p>
              <p className="mt-2 text-sm text-ink2 leading-relaxed">{da.cross_validation}</p>
            </div>
          )}
        </div>
        <div className="card-paper p-6 self-start">
          <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">Datenqualität</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-5xl text-burgundy"
                  style={{ fontVariationSettings: '"opsz" 144' }}>
              {Math.round((da.data_quality_score || 0) * 100)}
            </span>
            <span className="font-mono text-xs text-ink3">/100</span>
          </div>
          <div className="mt-4 h-1 bg-ink/10 rounded-full overflow-hidden">
            <div className="h-full bg-burgundy" style={{ width: `${Math.round((da.data_quality_score || 0) * 100)}%` }} />
          </div>
          <p className="mt-4 text-xs text-ink3">
            {da.data_quality_score >= 0.8 ? "Solide Datenbasis" : da.data_quality_score >= 0.5 ? "Akzeptabel · Lücken in Notizen" : "Kritische Datenlücken"}
          </p>
        </div>
      </div>

      {da.insights?.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow-ink mb-6">Pro Dokument</p>
          <ol className="space-y-8">
            {da.insights.map((ins: any, i: number) => (
              <li key={i} className="border-t border-ink/15 pt-5 break-inside-avoid">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="font-display text-xl text-ink">{ins.document_name}</h4>
                  <span className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy">{ins.doc_type} · {ins.confidence}-Conf</span>
                </div>
                {ins.key_findings?.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-ink2">
                    {ins.key_findings.map((f: string, j: number) => <li key={j} className="pl-3 border-l border-ink/15">{f}</li>)}
                  </ul>
                )}
                {ins.anomalies?.length > 0 && (
                  <div className="mt-3 bg-burgundy/5 px-4 py-3 border-l-2 border-burgundy">
                    <p className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy mb-2">Anomalien vs Branchen-Benchmark</p>
                    <ul className="space-y-1 text-sm text-ink2">
                      {ins.anomalies.map((a: string, j: number) => <li key={j}>↘ {a}</li>)}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {da.data_gaps?.length > 0 && (
        <div className="mt-10 border-l-2 border-gold pl-6">
          <p className="eyebrow">Was uns für eine 100%-Aussage fehlt</p>
          <ul className="mt-4 space-y-2 text-sm text-ink2">
            {da.data_gaps.map((g: string, i: number) => <li key={i}>· {g}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function AuditSection({ fr }: any) {
  const audit = fr.audit;
  if (!audit?.processes?.length) return null;
  const sorted = [...audit.processes].sort((a, b) => (b.estimated_savings_eur_year || 0) - (a.estimated_savings_eur_year || 0));
  const max = Math.max(...sorted.map((p) => p.estimated_savings_eur_year || 0));
  return (
    <section id="audit" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="04" label="Prozess-Audit" subtitle={`${audit.processes.length} Prozesse über 15 Hotel-Domains identifiziert · pro Prozess volle Detail-Tiefe`} />
      <p className="mt-8 text-ink2 leading-relaxed max-w-3xl">{audit.summary}</p>

      {/* Kompakte Übersicht-Liste */}
      <div className="mt-12 space-y-2">
        {sorted.map((p, i) => (
          <a key={i} href={`#process-${i}`}
             className="grid grid-cols-12 gap-4 items-center py-3 border-t border-ink/15 break-inside-avoid hover:bg-paper2 transition-colors duration-200">
            <div className="col-span-12 md:col-span-5">
              <p className="font-display text-lg text-ink leading-tight">{p.name}</p>
              <p className="text-xs text-ink3 mt-1">
                <DomainBadge value={p.domain} /> {p.primary_pain?.slice(0, 110)}…
              </p>
            </div>
            <div className="col-span-3 md:col-span-2 text-sm text-ink2 font-mono">
              {p.current_time_hours_per_week} h/Wo
            </div>
            <div className="col-span-3 md:col-span-2">
              <PotentialBadge value={p.automation_potential} />
            </div>
            <div className="col-span-6 md:col-span-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                <div className="h-full bg-burgundy" style={{ width: `${Math.min(100, ((p.estimated_savings_eur_year || 0) / max) * 100)}%` }} />
              </div>
              <span className="font-mono text-xs text-ink whitespace-nowrap">
                {(p.estimated_savings_eur_year || 0).toLocaleString("de-DE")} €/J
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Detail-Karten pro Prozess */}
      <div className="mt-20 space-y-12">
        {sorted.map((p, i) => <ProcessDetailCard key={i} idx={i} p={p} />)}
      </div>

      {audit.domains_unchecked?.length > 0 && (
        <div className="mt-16 pt-8 border-t border-ink/15">
          <p className="eyebrow">Domains ohne Befund</p>
          <ul className="mt-4 text-sm text-ink3 space-y-2 max-w-3xl">
            {audit.domains_unchecked.map((d: string, i: number) => (
              <li key={i} className="flex gap-3"><span className="text-burgundy">·</span><span>{d}</span></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function DomainBadge({ value }: { value?: string }) {
  if (!value) return null;
  const labels: Record<string, string> = {
    "front-office": "Front-Office",
    "housekeeping": "Housekeeping",
    "fnb-service": "F&B Service",
    "fnb-kueche": "F&B Küche",
    "wellness-spa": "Wellness/Spa",
    "mice": "MICE",
    "marketing": "Marketing",
    "crm-gaeste": "CRM",
    "beschaffung": "Beschaffung",
    "buchhaltung": "Buchhaltung",
    "gebaeude": "Gebäude",
    "personal": "Personal",
    "it": "IT",
    "compliance": "Compliance",
    "strategie-kpi": "Strategie · KPI",
  };
  return (
    <span className="inline-block mr-2 px-2 py-0.5 bg-burgundy/10 text-burgundy text-[10px] font-mono tracking-eyebrow uppercase">
      {labels[value] || value}
    </span>
  );
}

function ProcessDetailCard({ idx, p }: { idx: number; p: any }) {
  const c = p.compliance || {};
  const flags: { label: string; on: boolean }[] = [
    { label: "DSGVO", on: c.dsgvo_relevant },
    { label: "TSE · KassenSichV", on: c.tse_kasse_relevant },
    { label: "GoBD", on: c.gobd_relevant },
    { label: "AVV nötig", on: c.avv_needed },
  ];
  const activeFlags = flags.filter(f => f.on);

  return (
    <article id={`process-${idx}`} className="border border-ink/15 bg-paper p-8 lg:p-10 scroll-mt-24 break-inside-avoid">
      {/* Header */}
      <header className="grid grid-cols-12 gap-x-4 gap-y-3 mb-8 pb-6 border-b border-ink/15">
        <div className="col-span-12 md:col-span-8">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
              · {String(idx + 1).padStart(2, "0")} ·
            </span>
            <DomainBadge value={p.domain} />
            {p.sub_domain && (
              <span className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                {p.sub_domain}
              </span>
            )}
          </div>
          <p className="mt-3 font-display text-2xl lg:text-3xl text-ink leading-tight">
            {p.name}
          </p>
          <p className="mt-3 text-ink2 leading-relaxed max-w-2xl">
            {p.description}
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right space-y-2 font-mono text-[11px]">
          <div>
            <span className="text-ink3 tracking-eyebrow uppercase mr-2">Savings/J</span>
            <span className="text-burgundy font-medium">
              {(p.estimated_savings_eur_year || 0).toLocaleString("de-DE")} €
            </span>
          </div>
          <div>
            <span className="text-ink3 tracking-eyebrow uppercase mr-2">Zeit-Saving</span>
            <span className="text-ink">
              {p.estimated_time_saved_h_week || 0} h/Wo
            </span>
          </div>
          <div className="flex md:justify-end gap-2 items-center">
            <PotentialBadge value={p.automation_potential} />
            {p.quick_win_eligible && (
              <span className="text-[10px] font-mono tracking-eyebrow uppercase px-2 py-0.5 bg-gold/15 text-gold border border-gold/40">
                Quick Win
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Body: 2-Spalten */}
      <div className="grid grid-cols-12 gap-x-8 gap-y-10">
        {/* Linke Spalte: Ist-Situation */}
        <div className="col-span-12 md:col-span-6 space-y-6">
          <DetailBlock label="Heutiger Schmerz" body={p.primary_pain} />
          {p.workaround_today && <DetailBlock label="Workaround heute" body={p.workaround_today} />}
          <DetailGrid items={[
            { label: "Frequenz", value: frequencyLabel(p.frequency) },
            { label: "Volumen", value: p.volume_per_period || "—" },
            { label: "Aufwand heute", value: `${p.current_time_hours_per_week || 0} h/Woche` },
            { label: "Confidence", value: p.confidence || "—" },
          ]} />

          {p.stakeholders?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-3">Beteiligte heute</p>
              <ul className="space-y-2 text-sm">
                {p.stakeholders.map((s: any, j: number) => (
                  <li key={j} className="flex justify-between border-b border-ink/10 pb-1.5">
                    <span className="text-ink">{s.role}{s.approval_required && <span className="text-burgundy"> · Approval</span>}</span>
                    <span className="font-mono text-ink3">{s.fte_share ? `${(s.fte_share * 100).toFixed(0)}% FTE` : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rechte Spalte: Systeme + Compliance + Risiken */}
        <div className="col-span-12 md:col-span-6 space-y-6">
          {p.current_tools?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-3">Tools / Marken heute</p>
              <ul className="space-y-2 text-sm">
                {p.current_tools.map((t: any, j: number) => (
                  <li key={j} className="flex justify-between gap-3 border-b border-ink/10 pb-1.5">
                    <span className="text-ink3 font-mono text-[10px] tracking-eyebrow uppercase">{t.category}</span>
                    <span className="text-ink text-right">
                      {t.vendor_or_brand || (t.is_paper_or_excel ? "Excel/Papier" : "—")}
                      {t.monthly_cost_eur ? <span className="text-ink3 ml-2 font-mono text-xs">{t.monthly_cost_eur} €/Mo</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.touchpoints?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-3">System-Touchpoints</p>
              <ul className="space-y-1.5 text-sm">
                {p.touchpoints.map((t: any, j: number) => (
                  <li key={j} className="flex items-baseline gap-2 text-ink">
                    <span className="text-burgundy">→</span>
                    <span className="flex-1">{t.system}</span>
                    <span className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">{t.role}</span>
                    <IntegrationBadge value={t.integration_status} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(activeFlags.length > 0 || c.ai_act_risk_class !== "minimal") && (
            <div>
              <p className="eyebrow-ink mb-3">Compliance</p>
              <div className="flex flex-wrap gap-2">
                {activeFlags.map((f, j) => (
                  <span key={j} className="text-[10px] font-mono tracking-eyebrow uppercase px-2 py-1 bg-burgundy/10 text-burgundy border border-burgundy/30">
                    {f.label}
                  </span>
                ))}
                {c.ai_act_risk_class && c.ai_act_risk_class !== "minimal" && (
                  <span className="text-[10px] font-mono tracking-eyebrow uppercase px-2 py-1 bg-ink text-paper">
                    AI-Act · {c.ai_act_risk_class}
                  </span>
                )}
              </div>
              {c.notes && <p className="mt-2 text-xs text-ink3">{c.notes}</p>}
            </div>
          )}

          {p.risks_if_done_wrong?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-3">Risiken bei falscher Umsetzung</p>
              <ul className="space-y-1.5 text-sm text-ink2">
                {p.risks_if_done_wrong.map((r: string, j: number) => (
                  <li key={j} className="flex gap-2"><span className="text-burgundy">⚠</span><span>{r}</span></li>
                ))}
              </ul>
            </div>
          )}

          {p.data_gaps?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-3">Datenlücken</p>
              <ul className="space-y-1 text-sm text-ink3">
                {p.data_gaps.map((g: string, j: number) => (
                  <li key={j} className="flex gap-2"><span>·</span><span>{g}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-ink/15 grid grid-cols-12 gap-4 text-sm">
        {p.expected_quality_uplift && (
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow-ink mb-2">Erwarteter Qualitäts-Effekt</p>
            <p className="text-ink2 leading-relaxed">{p.expected_quality_uplift}</p>
          </div>
        )}
        {p.implementation_owner && (
          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow-ink mb-2">Umsetzungs-Owner</p>
            <p className="text-ink">{p.implementation_owner}</p>
          </div>
        )}
        {p.benchmark_ref && (
          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow-ink mb-2">Benchmark-Quelle</p>
            <p className="text-ink3 text-xs">{p.benchmark_ref}</p>
          </div>
        )}
      </footer>
    </article>
  );
}

function DetailBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null;
  return (
    <div>
      <p className="eyebrow-ink mb-2">{label}</p>
      <p className="text-ink2 leading-relaxed text-sm">{body}</p>
    </div>
  );
}

function DetailGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-ink/10 border border-ink/10">
      {items.map((it, j) => (
        <div key={j} className="bg-paper2 px-3 py-2">
          <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">{it.label}</p>
          <p className="text-sm text-ink mt-0.5">{it.value}</p>
        </div>
      ))}
    </div>
  );
}

function IntegrationBadge({ value }: { value?: string }) {
  if (!value || value === "unknown") return <span className="font-mono text-[9px] text-ink3">?</span>;
  const map: Record<string, { txt: string; cls: string }> = {
    "api-integrated": { txt: "API", cls: "bg-bottle/20 text-bottle" },
    "manual-sync": { txt: "Manual", cls: "bg-gold/20 text-gold" },
    "isolated": { txt: "Isoliert", cls: "bg-burgundy/15 text-burgundy" },
  };
  const m = map[value] || { txt: value, cls: "bg-ink/10 text-ink" };
  return <span className={`text-[9px] font-mono tracking-eyebrow uppercase px-1.5 py-0.5 ${m.cls}`}>{m.txt}</span>;
}

function frequencyLabel(v?: string) {
  return { daily: "Täglich", weekly: "Wöchentlich", monthly: "Monatlich", "ad-hoc": "Ad-hoc", seasonal: "Saisonal" }[v || ""] || v || "—";
}

function UseCasesSection({ fr }: any) {
  const ucs = fr.use_cases?.use_cases || [];
  if (!ucs.length) return null;
  const quickWins = ucs.filter((u: any) => u.quick_win);
  const others = ucs.filter((u: any) => !u.quick_win);
  return (
    <section id="use-cases" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="05" label="Use-Cases" subtitle="VUFVE-gefiltert · Valuable · Usable · Feasible · Viable · Ethical" />

      {fr.use_cases?.quick_wins_summary && (
        <p className="mt-8 text-ink2 leading-relaxed max-w-3xl pull-quote text-ink"
           style={{ fontStyle: "italic" }}>
          {fr.use_cases.quick_wins_summary}
        </p>
      )}

      {quickWins.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow text-gold">Quick Wins · 0–3 Monate</p>
          <div className="mt-6 grid md:grid-cols-2 gap-px bg-ink/15 border-y border-ink/15">
            {quickWins.map((u: any, i: number) => <UseCaseCard key={i} u={u} highlight />)}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow">Weitere Use-Cases · Phase 2 + 3</p>
          <div className="mt-6 grid md:grid-cols-2 gap-px bg-ink/15 border-y border-ink/15">
            {others.map((u: any, i: number) => <UseCaseCard key={i} u={u} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function UseCaseCard({ u, highlight }: { u: any; highlight?: boolean }) {
  return (
    <article className="bg-paper p-7 break-inside-avoid">
      <div className="flex items-baseline justify-between mb-3">
        <span className={`font-mono text-[9px] tracking-eyebrow uppercase ${highlight ? "text-gold" : "text-burgundy"}`}>
          {u.ai_pattern} · {u.complexity}
        </span>
        {highlight && (
          <span className="font-mono text-[8px] tracking-eyebrow uppercase bg-gold text-paper px-2 py-0.5">
            Quick Win
          </span>
        )}
      </div>
      <h3 className="font-display text-xl text-ink leading-tight"
          style={{ fontVariationSettings: '"SOFT" 50' }}>
        {u.name}
      </h3>
      <p className="mt-3 text-sm text-ink2 leading-relaxed">{u.expected_impact}</p>
      {u.target_process && (
        <p className="mt-3 text-xs text-ink3">
          Prozess: <span className="text-ink">{u.target_process}</span>
        </p>
      )}
      {u.vufve && <VufveSpider v={u.vufve} />}
    </article>
  );
}

function VufveSpider({ v }: { v: any }) {
  const dims = [
    { key: "valuable", label: "V", pass: v.valuable, reason: v.valuable_reason },
    { key: "usable", label: "U", pass: v.usable, reason: v.usable_reason },
    { key: "feasible", label: "F", pass: v.feasible, reason: v.feasible_reason },
    { key: "viable", label: "V", pass: v.viable, reason: v.viable_reason },
    { key: "ethical", label: "E", pass: v.ethical, reason: v.ethical_reason },
  ];
  return (
    <div className="mt-5 pt-5 border-t border-ink/10">
      <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3 mb-3">VUFVE-Check</p>
      <div className="grid grid-cols-5 gap-2">
        {dims.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5" title={d.reason || ""}>
            <span className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${d.pass ? "bg-burgundy text-paper" : "bg-ink/10 text-ink3 line-through"}`}>
              {d.label}
            </span>
            <span className={`font-mono text-[8px] tracking-eyebrow uppercase ${d.pass ? "text-burgundy" : "text-ink3"}`}>
              {d.pass ? "✓" : "✕"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AntiUseCasesSection({ fr }: any) {
  // Anti-Use-Cases werden im quick_wins_summary genannt — wir extrahieren nur eine kleine Sektion
  // mit klarem "Nicht tun"-Statement aus dem Reporter
  if (!fr.executive_summary) return null;
  const summary = fr.executive_summary;
  // Heuristisch: Sätze die "Kein", "Nicht", "Keinen" enthalten und einen Use-Case beschreiben
  const matches = summary.match(/[^.]*(?:Kein\w*|Nicht\s+\w+|verzichten)\b[^.]*\./gi);
  return (
    <section id="anti" className="border-b border-ink/15 py-20 scroll-mt-24 break-inside-avoid">
      <SectionHeader num="06" label="Was wir NICHT empfehlen" subtitle="Anti-Use-Cases · expliziter Verzicht mit Begründung" />
      <div className="mt-8 bg-ink text-paper p-10">
        <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-6">
          Senior-Consultant-Position
        </p>
        {matches && matches.length > 0 ? (
          <ul className="space-y-4">
            {matches.slice(0, 3).map((m: string, i: number) => (
              <li key={i} className="font-display text-xl leading-snug border-l-2 border-gold pl-5"
                  style={{ fontVariationSettings: '"SOFT" 50' }}>
                {m.trim()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-paper/80">
            Keine expliziten Anti-Use-Cases vom Reporter genannt. Falls Sie eine Empfehlung vermissen, klären Sie das in der Berater-Session.
          </p>
        )}
      </div>
    </section>
  );
}

function ToolsSection({ fr }: any) {
  const tools = fr.tools?.recommendations || [];
  if (!tools.length) return null;
  const totalMo = fr.tools?.total_monthly_cost_eur || tools.reduce((sum: number, t: any) => sum + (t.monthly_cost_eur || 0), 0);
  const totalSetup = fr.tools?.total_setup_cost_eur || tools.reduce((sum: number, t: any) => sum + (t.setup_cost_eur || 0), 0);
  return (
    <section id="tools" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="07" label="Tool-Stack"
        subtitle={`${tools.length} Empfehlungen · ${totalMo.toLocaleString("de-DE")} €/Mo all-in · ${totalSetup.toLocaleString("de-DE")} € Setup`} />
      <p className="mt-8 text-ink2 leading-relaxed max-w-3xl">{fr.tools?.stack_summary}</p>

      {fr.tools?.integration_complexity_summary && (
        <p className="mt-4 text-sm text-ink3 italic max-w-3xl border-l-2 border-burgundy/30 pl-4">
          {fr.tools.integration_complexity_summary}
        </p>
      )}

      <div className="mt-12 space-y-8">
        {tools.map((t: any, i: number) => <ToolDetailCard key={i} t={t} />)}
      </div>
    </section>
  );
}

function ToolDetailCard({ t }: { t: any }) {
  const c = t.compliance || {};
  const complianceTags: { label: string; on: boolean }[] = [
    { label: "EU-Hosting", on: !!c.eu_hosting },
    { label: "AVV", on: !!c.avv_available },
    { label: "ISO 27001", on: !!c.iso_27001 },
    { label: "SOC 2", on: !!c.soc2 },
    { label: "TSE-zert.", on: !!c.tse_zertifiziert },
    { label: "GoBD", on: !!c.gobd_konform },
  ];
  const activeTags = complianceTags.filter(x => x.on);

  return (
    <article className="border border-ink/15 bg-paper p-7 lg:p-9 break-inside-avoid">
      <header className="grid grid-cols-12 gap-x-6 gap-y-3 pb-6 border-b border-ink/15">
        <div className="col-span-12 md:col-span-7">
          <p className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy">
            Für: {t.use_case_name}{t.target_process && ` · ${t.target_process}`}
          </p>
          <h3 className="mt-2 font-display text-2xl lg:text-3xl text-ink leading-tight"
              style={{ fontVariationSettings: '"SOFT" 50' }}>
            {t.primary_tool}
          </h3>
          <p className="mt-2 text-xs text-ink3 font-mono tracking-eyebrow uppercase">
            {t.primary_tool_vendor_country && `Vendor · ${t.primary_tool_vendor_country}`}
            {t.primary_tool_pricing_model && ` · ${t.primary_tool_pricing_model}`}
            {t.time_to_value_weeks && ` · TTV ${t.time_to_value_weeks} Wo`}
          </p>
        </div>
        <div className="col-span-12 md:col-span-5 md:text-right space-y-1 font-mono text-[11px]">
          <p>
            <span className="text-ink3 tracking-eyebrow uppercase mr-2">€/Monat</span>
            <span className="text-burgundy font-medium text-base">
              {(t.monthly_cost_eur || 0).toLocaleString("de-DE")}
            </span>
          </p>
          <p>
            <span className="text-ink3 tracking-eyebrow uppercase mr-2">Setup</span>
            <span className="text-ink">
              {(t.setup_cost_eur || 0).toLocaleString("de-DE")} € · {t.setup_complexity}
            </span>
          </p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-12 gap-x-8 gap-y-6">
        <div className="col-span-12 md:col-span-7 space-y-5">
          <DetailBlock label="Warum dieses Tool" body={t.why_this_tool} />
          {t.alternative_tools?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-2">Alternativen geprüft</p>
              <p className="text-sm text-ink2">{t.alternative_tools.join(" · ")}</p>
              {t.why_not_alternatives && <p className="mt-2 text-xs text-ink3 italic">{t.why_not_alternatives}</p>}
            </div>
          )}
          <DetailBlock label="Integration in bestehenden Stack" body={t.integration_with_existing} />
          {t.required_integrations?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-2">Schnittstellen-Bedarf</p>
              <div className="flex flex-wrap gap-1.5">
                {t.required_integrations.map((s: string, j: number) => (
                  <span key={j} className="font-mono text-[10px] px-2 py-0.5 bg-paper2 text-ink2 border border-ink/15">{s}</span>
                ))}
              </div>
            </div>
          )}
          {t.data_flow && <DetailBlock label="Daten-Fluss" body={t.data_flow} />}
        </div>

        <div className="col-span-12 md:col-span-5 space-y-5">
          {activeTags.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-2">Compliance · Hosting</p>
              <div className="flex flex-wrap gap-1.5">
                {activeTags.map((tag, j) => (
                  <span key={j} className="font-mono text-[10px] px-2 py-0.5 bg-bottle/15 text-bottle border border-bottle/30 tracking-eyebrow uppercase">
                    {tag.label}
                  </span>
                ))}
                {c.ai_act_class && c.ai_act_class !== "minimal" && (
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-burgundy/15 text-burgundy border border-burgundy/40 tracking-eyebrow uppercase">
                    AI-Act · {c.ai_act_class}
                  </span>
                )}
              </div>
            </div>
          )}
          {t.decision_makers_needed?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-2">Entscheider</p>
              <p className="text-sm text-ink2">{t.decision_makers_needed.join(" · ")}</p>
            </div>
          )}
          {t.risks?.length > 0 && (
            <div>
              <p className="eyebrow-ink mb-2">Risiken</p>
              <ul className="space-y-1 text-sm text-ink2">
                {t.risks.map((r: string, j: number) => (
                  <li key={j} className="flex gap-2"><span className="text-burgundy">·</span><span>{r}</span></li>
                ))}
              </ul>
            </div>
          )}
          {t.exit_strategy && <DetailBlock label="Exit-Strategie" body={t.exit_strategy} />}
        </div>
      </div>
    </article>
  );
}

function ROISection({ fr }: any) {
  const roi = fr.roi;
  if (!roi?.line_items?.length) return null;
  const items = [...roi.line_items].sort((a, b) => (b.savings_eur_year_1 || 0) - (a.savings_eur_year_1 || 0));
  return (
    <section id="roi" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="08" label="ROI-Modell" subtitle="Pro Use-Case · Y1 · 3-Jahre · Payback" />
      <p className="mt-8 text-ink2 leading-relaxed max-w-3xl">{roi.summary}</p>

      {/* Waterfall — Investment → Savings → Net */}
      <div className="mt-12 bg-paper2 p-10">
        <p className="eyebrow mb-6">3-Jahres-Cash-Story</p>
        <RoiWaterfall
          investment={roi.total_investment_eur * 1.2}
          savings={roi.total_savings_eur_3_years}
          net={roi.total_savings_eur_3_years - roi.total_investment_eur * 1.2}
        />
      </div>

      <div className="mt-12 overflow-x-auto">
        <p className="eyebrow mb-6">Pro Use-Case · Cashflow 3 Jahre</p>
        <table className="w-full border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-ink/30">
              <th className="text-left py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Use-Case</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Setup</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Lizenz/J</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Y1</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Y2</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Y3</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Payback</th>
              <th className="text-right py-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">3J-ROI</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any, i: number) => (
              <tr key={i} className="border-b border-ink/10">
                <td className="py-3 text-sm text-ink">
                  {it.use_case_name}
                  {it.confidence && it.confidence !== "high" && (
                    <span className="ml-2 font-mono text-[9px] tracking-eyebrow uppercase text-ink3">· {it.confidence} conf.</span>
                  )}
                </td>
                <td className="text-right py-3 font-mono text-xs text-ink3">{(it.setup_cost_eur || 0).toLocaleString("de-DE")} €</td>
                <td className="text-right py-3 font-mono text-xs text-ink3">{(it.license_cost_eur_year || 0).toLocaleString("de-DE")} €</td>
                <td className="text-right py-3 font-mono text-sm text-ink"><strong>{(it.savings_eur_year_1 || 0).toLocaleString("de-DE")} €</strong></td>
                <td className="text-right py-3 font-mono text-xs text-ink2">{(it.savings_eur_year_2 || 0).toLocaleString("de-DE")} €</td>
                <td className="text-right py-3 font-mono text-xs text-ink2">{(it.savings_eur_year_3 || 0).toLocaleString("de-DE")} €</td>
                <td className="text-right py-3 font-mono text-sm text-ink2">{it.payback_months} Mo</td>
                <td className="text-right py-3 font-mono text-sm text-burgundy"><strong>{it.three_year_roi_percent} %</strong></td>
              </tr>
            ))}
            <tr className="border-t-2 border-ink/30 bg-paper2/50">
              <td className="py-4 font-display text-lg">Gesamt</td>
              <td className="text-right py-4 font-mono text-sm text-ink2">{(roi.total_setup_cost_eur || 0).toLocaleString("de-DE")} €</td>
              <td className="text-right py-4 font-mono text-sm text-ink2">{(roi.total_license_cost_eur_year || 0).toLocaleString("de-DE")} €</td>
              <td className="text-right py-4 font-mono text-base text-burgundy"><strong>{(roi.total_savings_eur_year_1 || 0).toLocaleString("de-DE")} €</strong></td>
              <td className="text-right py-4 font-mono text-sm text-ink">{(roi.total_savings_eur_year_2 || 0).toLocaleString("de-DE")} €</td>
              <td className="text-right py-4 font-mono text-sm text-ink">{(roi.total_savings_eur_year_3 || 0).toLocaleString("de-DE")} €</td>
              <td className="text-right py-4 font-mono text-base">{roi.total_payback_months} Mo</td>
              <td className="text-right py-4 font-mono text-base">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Annahmen + Sensitivity */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div>
          <p className="eyebrow mb-3">Tragende Annahmen</p>
          <ul className="space-y-2 text-sm text-ink2">
            {Array.from(new Set(items.flatMap((it: any) => it.assumptions || []))).slice(0, 10).map((a: any, i: number) => (
              <li key={i} className="flex gap-2"><span className="text-burgundy">·</span><span>{String(a)}</span></li>
            ))}
          </ul>
        </div>
        {roi.sensitivity_notes && (
          <div>
            <p className="eyebrow mb-3">Sensitivität</p>
            <p className="text-sm text-ink2 leading-relaxed border-l-2 border-burgundy/30 pl-4">
              {roi.sensitivity_notes}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function RoiWaterfall({ investment, savings, net }: { investment: number; savings: number; net: number }) {
  const max = Math.max(investment, savings, Math.abs(net));
  return (
    <div className="grid grid-cols-3 gap-6 items-end">
      <Bar label="Investment 3J" value={investment} max={max} color="bg-ink" />
      <Bar label="Savings 3J" value={savings} max={max} color="bg-burgundy" />
      <Bar label="Netto-Vorteil" value={net} max={max} color="bg-gold" highlight />
    </div>
  );
}

function Bar({ label, value, max, color, highlight }: any) {
  const h = Math.max(8, (Math.abs(value) / max) * 240);
  return (
    <div>
      <p className={`font-mono text-[9px] tracking-eyebrow uppercase mb-2 ${highlight ? "text-gold" : "text-ink3"}`}>{label}</p>
      <div className={`${color}`} style={{ height: `${h}px` }} />
      <p className={`mt-3 font-display ${highlight ? "text-3xl text-gold" : "text-2xl text-ink"}`}
         style={{ fontVariationSettings: '"opsz" 144' }}>
        {Math.round(value).toLocaleString("de-DE")} €
      </p>
    </div>
  );
}

function RoadmapSection({ fr }: any) {
  const rm = fr.roadmap;
  if (!rm?.phases?.length) return null;
  return (
    <section id="roadmap" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="09" label="12-Monats-Roadmap" subtitle={`${rm.total_effort_pt} Personentage total · 3 Phasen`} />

      {rm.critical_path && (
        <div className="mt-8 bg-burgundy/5 border-l-2 border-burgundy px-6 py-4 max-w-3xl">
          <p className="eyebrow mb-2">Critical Path</p>
          <p className="text-sm text-ink2 leading-relaxed italic">{rm.critical_path}</p>
          {rm.critical_path_risks?.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-ink3">
              {rm.critical_path_risks.map((r: string, j: number) => (
                <li key={j} className="flex gap-2"><span className="text-burgundy">⚠</span>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-12 space-y-px bg-ink/15 border-y border-ink/15">
        {rm.phases.map((ph: any, i: number) => (
          <article key={i} className="bg-paper p-8 lg:p-10 break-inside-avoid">
            <header className="grid grid-cols-12 gap-4 items-baseline mb-6 pb-5 border-b border-ink/15">
              <div className="col-span-12 md:col-span-6">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                  · Phase {ph.phase_number} · {ph.duration_months}
                </p>
                <h3 className="mt-2 font-display text-3xl text-ink leading-tight"
                    style={{ fontVariationSettings: '"SOFT" 50' }}>
                  {ph.name}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-6 md:text-right space-y-1 font-mono text-[11px]">
                <p>
                  <span className="text-ink3 tracking-eyebrow uppercase mr-2">Aufwand</span>
                  <span className="text-ink font-medium">{ph.estimated_effort_pt} PT</span>
                </p>
                {ph.decision_makers?.length > 0 && (
                  <p>
                    <span className="text-ink3 tracking-eyebrow uppercase mr-2">Freigabe</span>
                    <span className="text-ink">{ph.decision_makers.join(" · ")}</span>
                  </p>
                )}
              </div>
            </header>

            <p className="text-base text-ink2 leading-relaxed max-w-3xl">{ph.expected_outcomes}</p>

            <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-6">
                {ph.use_cases?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Use-Cases dieser Phase</p>
                    <ul className="space-y-1 text-sm text-ink">
                      {ph.use_cases.map((uc: string, j: number) => <li key={j}>· {uc}</li>)}
                    </ul>
                  </div>
                )}
                {ph.required_tools?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Benötigte Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ph.required_tools.map((t: string, j: number) => (
                        <span key={j} className="font-mono text-[10px] px-2 py-0.5 bg-paper2 text-ink2 border border-ink/15">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {ph.dependencies?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Voraussetzungen</p>
                    <ul className="space-y-1 text-sm text-ink2">
                      {ph.dependencies.map((d: string, j: number) => <li key={j}>← {d}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {ph.milestones?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Meilensteine</p>
                    <ol className="space-y-3">
                      {ph.milestones.map((m: any, j: number) => (
                        <li key={j} className="grid grid-cols-12 gap-3 items-baseline border-l-2 border-burgundy/30 pl-3">
                          <span className="col-span-2 font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">W{m.week}</span>
                          <div className="col-span-10">
                            <p className="text-sm text-ink leading-tight">{m.title}</p>
                            {m.success_criterion && (
                              <p className="text-xs text-ink3 mt-1 italic">{m.success_criterion}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {ph.success_metrics?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Success-Metrics</p>
                    <ul className="space-y-1 text-sm text-ink2">
                      {ph.success_metrics.map((m: string, j: number) => (
                        <li key={j} className="flex gap-2"><span className="text-bottle">✓</span>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ph.kill_criteria?.length > 0 && (
                  <div>
                    <p className="eyebrow-ink mb-3">Kill-Kriterien</p>
                    <ul className="space-y-1 text-sm text-ink2">
                      {ph.kill_criteria.map((k: string, j: number) => (
                        <li key={j} className="flex gap-2"><span className="text-burgundy">⊘</span>{k}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComplianceSection({ fr }: any) {
  const cp = fr.compliance;
  if (!cp?.flags?.length) return null;
  return (
    <section id="compliance" className="border-b border-ink/15 py-20 scroll-mt-24">
      <SectionHeader num="10" label="Compliance" subtitle="DSGVO · EU AI-Act · Branchen-Pflichten" />
      <p className="mt-8 text-ink2 leading-relaxed max-w-3xl">{cp.general_advice}</p>

      <div className="mt-12 space-y-3">
        {cp.flags.map((f: any, i: number) => (
          <article key={i} className="border-t border-ink/15 pt-4 grid grid-cols-12 gap-4 break-inside-avoid">
            <div className="col-span-12 md:col-span-4">
              <p className="font-display text-lg text-ink">{f.use_case_name}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.dsgvo_relevant && <Tag color="ink">DSGVO</Tag>}
                {f.ai_act_risk_class && f.ai_act_risk_class !== "minimal" && <Tag color="burgundy">AI-Act {f.ai_act_risk_class}</Tag>}
                {f.ai_act_risk_class === "minimal" && <Tag color="ink3">AI-Act minimal</Tag>}
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 text-sm text-ink2">
              {f.dsgvo_reason && <p className="mb-2"><span className="font-mono text-[9px] tracking-eyebrow uppercase text-burgundy mr-1">Reason:</span>{f.dsgvo_reason}</p>}
              {f.industry_specific?.length > 0 && (
                <ul className="space-y-0.5 text-xs">
                  {f.industry_specific.map((s: string, j: number) => <li key={j}>· {s}</li>)}
                </ul>
              )}
            </div>
            <div className="col-span-12 md:col-span-4 text-sm text-ink2">
              {f.mitigations?.length > 0 && (
                <>
                  <p className="font-mono text-[9px] tracking-eyebrow uppercase text-gold mb-1">Mitigation</p>
                  <ul className="space-y-0.5 text-xs">
                    {f.mitigations.map((m: string, j: number) => <li key={j}>→ {m}</li>)}
                  </ul>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {cp.disclaimer && (
        <p className="mt-12 text-xs text-ink3 italic max-w-3xl">{cp.disclaimer}</p>
      )}
    </section>
  );
}

function DeliverablesSection({ runId }: { runId: string }) {
  return (
    <section id="deliverables" className="border-b border-ink/15 py-20 scroll-mt-24 print:hidden">
      <SectionHeader num="11" label="Downloads" subtitle="Pitch-Deck · ROI-Excel · Voll-PDF" />
      <div className="mt-10 flex flex-wrap gap-3">
        <DownloadButton runId={runId} fmt="pptx" label="PPTX Pitch-Deck" />
        <DownloadButton runId={runId} fmt="xlsx" label="Excel ROI-Modell" />
        <DownloadButton runId={runId} fmt="pdf" label="PDF Voll-Report" />
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
        Tipp · diesen Browser-Bericht als PDF: Cmd+P · Hintergrundgrafiken AN · Querformat
      </p>

      <div className="mt-12 border-t border-ink/15 pt-8 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="eyebrow">Und jetzt?</p>
          <p className="mt-2 font-display text-xl text-ink leading-snug">Aus der Analyse Umsetzung machen.</p>
          <p className="mt-1 text-sm text-ink2">Use-Cases als Board verfolgen — Backlog → In Arbeit → Erledigt.</p>
        </div>
        <Link href={`/operations/${runId}`} className="btn-primary shrink-0">Zur Umsetzung →</Link>
      </div>
    </section>
  );
}

function DownloadButton({ runId, fmt, label }: { runId: string; fmt: "xlsx" | "pptx" | "pdf"; label: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function handle() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.downloadDeliverable(runId, fmt);
      window.open(res.signed_url, "_blank");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handle} className="btn-outline" disabled={loading} title={err || ""}>
      {loading ? "lädt…" : label}
      <span className="font-mono">↓</span>
    </button>
  );
}

function DisclaimerSection() {
  return (
    <section className="py-16 max-w-3xl">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">Disclaimer</p>
      <p className="mt-4 text-sm text-ink3 leading-relaxed italic">
        Dieser Bericht ersetzt keine Rechtsberatung. Compliance-Hinweise sind strukturierte Empfehlungen — vor Implementierung jedes Use-Cases ist die Konsultation mit einem qualifizierten DSGVO-Beauftragten und Fach-Anwalt für IT-Recht zwingend.
        Multi-Agent-Analyse basiert auf LLM-Synthese · einzelne Zahlen-Schätzungen können Abweichungen von ±25 % aufweisen · validieren Sie kritische Annahmen mit Ihren echten Daten vor jeder Investitionsentscheidung.
      </p>
      <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
        Erstellt mit AI-Adoption-Studio · 10 Spezialisten-Agents · Claude Sonnet 4.6 · ElevenLabs Ada
      </p>
    </section>
  );
}

/* ═══════════════ ATOMS ═══════════════ */

function SectionHeader({ num, label, subtitle }: { num: string; label: string; subtitle?: string }) {
  return (
    <header className="flex items-baseline gap-6 mb-2">
      <span className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 w-10">{num}</span>
      <div>
        <h2 className="font-display text-display-md text-ink leading-[1.05]"
            style={{ fontVariationSettings: '"SOFT" 50' }}>
          {label}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-ink3 italic">{subtitle}</p>}
      </div>
    </header>
  );
}

function KpiTile({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="bg-paper p-8">
      <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">{label}</p>
      <p className={`mt-3 font-display text-4xl md:text-5xl ${accent ? "text-burgundy" : "text-ink"} leading-none`}
         style={{ fontVariationSettings: '"opsz" 144' }}>
        {value}
      </p>
      <p className="mt-2 font-mono text-[9px] tracking-eyebrow uppercase text-ink3">{unit}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-ink/15 pt-4">
      <p className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">{label}</p>
      <p className="mt-2 text-ink">{value}</p>
    </div>
  );
}

function PotentialBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    high: "bg-burgundy text-paper",
    medium: "bg-gold text-paper",
    low: "bg-ink/10 text-ink3",
  };
  return (
    <span className={`inline-block font-mono text-[9px] tracking-eyebrow uppercase px-2 py-0.5 ${colors[value] || "bg-ink/10 text-ink3"}`}>
      {value}
    </span>
  );
}

function Tag({ children, color }: { children: any; color: "ink" | "burgundy" | "ink3" | "gold" }) {
  const map: Record<string, string> = {
    ink: "bg-ink text-paper",
    burgundy: "bg-burgundy text-paper",
    ink3: "bg-ink/10 text-ink3",
    gold: "bg-gold text-paper",
  };
  return (
    <span className={`inline-block font-mono text-[9px] tracking-eyebrow uppercase px-2 py-0.5 ${map[color]}`}>
      {children}
    </span>
  );
}

function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        body { background: white !important; }
        nav, .print\\:hidden { display: none !important; }
        section { break-inside: avoid; }
        .break-inside-avoid { break-inside: avoid; }
        a { color: inherit !important; text-decoration: none !important; }
      }
    `}</style>
  );
}
