import Link from "next/link";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import { StatusPill } from "@/components/StatusPill";

/**
 * Agents-Seite · Director's Cut (26.05.2026).
 * Editorial-Design. Zeigt die Agenten als Bausteine auf dem Claude Agent SDK
 * (im Aufbau) + visuelles Architektur-Diagramm. Kein "Ada", keine erfundenen Zahlen.
 */

type Status = "live" | "building" | "planned";

const FLOW: { n: string; name: string; role: string; status: Status }[] = [
  { n: "01", name: "Web-Research", role: "Vorab-Recherche · Tool: Web-Suche", status: "live" },
  { n: "02", name: "Dokumenten-Analyst", role: "liest Dateien · Tools: Parser, KPI-Mapping", status: "live" },
  { n: "03", name: "Prozess-Auditor", role: "findet Zeitfresser · 15 Domains", status: "live" },
  { n: "04", name: "Use-Case-Generator", role: "Ansatzpunkte · Quick-Win-Filter", status: "building" },
  { n: "05", name: "Tool-Empfehlung", role: "Werkzeuge · DSGVO/TSE-Check", status: "building" },
  { n: "06", name: "Wirtschaftlichkeit", role: "Aufwand · Nutzen · Amortisation", status: "planned" },
  { n: "07", name: "Compliance-Check", role: "DSGVO · EU-AI-Act · Branche", status: "planned" },
  { n: "08", name: "Reporter", role: "verdichtet alle Outputs lesbar", status: "building" },
];

const DETAILS: { id: string; n: string; name: string; role: string; status: Status; purpose: string; file: string }[] = [
  { id: "web-research", n: "00", name: "Web-Research", role: "Vorab-Recherche", status: "live", purpose: "Sucht öffentliche Infos zum Haus und Region-Benchmarks, damit das Gespräch mit Kontext startet — der Agent weiß schon ein bisschen was, bevor das erste Wort fällt.", file: "agents/web_research.py" },
  { id: "document-analyst", n: "01", name: "Dokumenten-Analyst", role: "Daten einlesen", status: "live", purpose: "Liest hochgeladene Dateien — PDF, Excel, CSV — und macht daraus eine strukturierte Kennzahlen-Übersicht: Belegung, Durchschnittspreis, OTA-Anteil, Wareneinsatz. Persönliches wird vorher anonymisiert.", file: "agents/document_analyst.py" },
  { id: "process-auditor", n: "02", name: "Prozess-Auditor", role: "Prozesse finden", status: "live", purpose: "Findet aus Daten + Gespräch die zeitfressenden Abläufe, bewertet ihr Automatisierungs-Potenzial und benennt, wo am meisten Zeit verloren geht.", file: "agents/process_auditor.py" },
  { id: "use-case-generator", n: "03", name: "Use-Case-Generator", role: "Ansatzpunkte", status: "building", purpose: "Übersetzt die Engpässe in konkrete Anwendungsfälle und markiert die schnellen Erfolge — das, was in wenigen Wochen umsetzbar ist.", file: "agents/use_case_generator.py" },
  { id: "tool-recommender", n: "04", name: "Tool-Empfehlung", role: "Werkzeuge", status: "building", purpose: "Empfiehlt pro Ansatzpunkt ein konkretes Tool plus Alternativen, schätzt Kosten und Aufwand und beschreibt, wie es in den bestehenden Stack passt.", file: "agents/tool_recommender.py" },
  { id: "roi-calculator", n: "05", name: "Wirtschaftlichkeit", role: "Geld-Rechnung", status: "planned", purpose: "Rechnet pro Ansatzpunkt Aufwand, Einsparung und Amortisation — nachvollziehbar und ehrlich, nicht schöngerechnet.", file: "agents/roi_calculator.py" },
  { id: "compliance-checker", n: "06", name: "Compliance-Check", role: "DSGVO · AI-Act", status: "planned", purpose: "Prüft jeden Vorschlag auf DSGVO-Relevanz, EU-AI-Act-Risikoklasse und Branchen-Recht. Strukturierte Hinweise mit klarem Disclaimer — ausdrücklich keine Rechtsberatung.", file: "agents/compliance_checker.py" },
  { id: "reporter", n: "07", name: "Reporter", role: "Zusammenfassung", status: "building", purpose: "Bündelt alle Ergebnisse zu einer kurzen, lesbaren Zusammenfassung — konkret, ohne Buzzwords, mit klarer Empfehlung. Auch mal mit einem ehrlichen 'Nein, das lohnt sich nicht'.", file: "agents/reporter.py" },
];

const DOT: Record<Status, string> = { live: "#7A8471", building: "#B8945F", planned: "#7D7872" };

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <EditorialHeader />

      {/* HERO */}
      <section className="brutal-bg-light border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 pb-12">
          <p className="eyebrow mb-4">· Die Agenten</p>
          <h1 className="h-brutal-md text-ink max-w-4xl">
            Mehrere Spezialisten. <em className="italic-accent text-burgundy">Ein</em> Ablauf.
          </h1>
          <p className="mt-8 text-lg text-ink/70 max-w-3xl leading-relaxed">
            Jeder Agent ist ein eigenständiger Baustein mit klarem Auftrag und eigenen Tools — nacheinander
            und parallel orchestriert. Kein Mega-Prompt, sondern eine wiederverwendbare{" "}
            <em className="italic-accent text-burgundy">Agenten-Library auf dem Claude Agent SDK</em>{" "}
            <span className="text-ink/45">(im Aufbau)</span>, mit prüfbaren Zwischen-Ergebnissen.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
            <div className="bg-paper p-5 text-center">
              <p className="brutal-rank text-ink" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>8</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-1">Fach-Agenten</p>
            </div>
            <div className="bg-paper p-5 text-center">
              <p className="brutal-rank text-ink" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>3</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-1">Output-Generatoren</p>
            </div>
            <div className="bg-paper p-5 text-center">
              <p className="brutal-rank text-burgundy" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)" }}>SDK</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-1">Claude Agent SDK · im Aufbau</p>
            </div>
            <div className="bg-paper p-5 text-center">
              <p className="brutal-rank text-burgundy" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)" }}>Claude</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-1">je Agent ein Modell-Call</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDK-DIAGRAMM */}
      <section className="brutal-bg-dark border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-20">
          <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-4">· So ist es gebaut · Claude Agent SDK</p>
          <h2 className="h-brutal-sm text-paper">
            Ein Orchestrator. Acht Agenten. <em className="italic-accent text-gold">Eine Library.</em>
          </h2>
          <p className="mt-5 text-paper/70 max-w-3xl leading-relaxed">
            Das Studio ist als wiederverwendbare Agenten-Library auf dem{" "}
            <em className="italic-accent text-gold">Claude Agent SDK</em> aufgebaut{" "}
            <span className="text-paper/45">(im Aufbau)</span>. Jeder Agent ist ein eigenständiger SDK-Baustein
            mit klarem Auftrag und eigenen Tools. Der Orchestrator steuert die Reihenfolge, reicht den Kontext
            weiter und sammelt die Ergebnisse ein. Dasselbe Muster lässt sich auf andere Branchen übertragen.
          </p>

          <div className="mt-12 border border-paper/15">
            <div className="grid md:grid-cols-3 gap-px bg-paper/15">
              {[
                { k: "Eingang", t: "Upload", b: "GuV · Reports · Prozess-Doku" },
                { k: "Eingang", t: "Voice-Interview", b: "freundlich, geprimt mit der Analyse" },
                { k: "Daten", t: "Kontext-Objekt", b: "strukturierte Basis für alle Agenten" },
              ].map((c, i) => (
                <div key={i} className="bg-[#0A0A0A] p-5">
                  <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold">{c.k}</p>
                  <p className="mt-2 font-display text-lg text-paper"><em>{c.t}</em></p>
                  <p className="text-xs text-paper/55 mt-1">{c.b}</p>
                </div>
              ))}
            </div>
            <div className="bg-burgundy text-paper p-6 text-center">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/70">▼ Orchestrator · Claude Agent SDK ▼</p>
              <p className="mt-1 font-display text-xl lg:text-2xl"><em>steuert Reihenfolge · übergibt Kontext · sammelt Ergebnisse</em></p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/15">
              {FLOW.map((a) => (
                <div key={a.n} className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gold">{a.n}</span>
                    <span style={{ color: DOT[a.status] }}>●</span>
                  </div>
                  <p className="mt-2 font-display text-base text-paper"><em>{a.name}</em></p>
                  <p className="text-xs text-paper/55 mt-1">{a.role}</p>
                </div>
              ))}
            </div>
            <div className="bg-gold/15 border-t border-paper/15 p-6 grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold">▼ Ausgang</p>
                <p className="mt-1 font-display text-xl text-paper"><em>Report · Excel · PDF</em></p>
              </div>
              <div className="md:text-right md:self-end">
                <p className="text-sm text-paper/70">Realistische, umsetzbare Empfehlungen — kein Hollywood.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-eyebrow uppercase text-paper/55">
            <span><span style={{ color: "#7A8471" }}>●</span> läuft</span>
            <span><span style={{ color: "#B8945F" }}>◐</span> im Bau</span>
            <span><span style={{ color: "#7D7872" }}>○</span> geplant</span>
            <span className="text-paper/40">· jeder Baustein unten im Detail ↓</span>
          </div>
        </div>
      </section>

      {/* AGENT-DETAILS */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 space-y-px bg-ink/10">
        {DETAILS.map((a) => (
          <article key={a.id} id={a.id} className="bg-paper p-8 lg:p-10 grid md:grid-cols-[90px_1fr] gap-6 scroll-mt-24">
            <div className="brutal-rank text-burgundy">{a.n}</div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-display text-2xl lg:text-3xl text-ink"><em>{a.name}</em></h2>
                <span className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">{a.role}</span>
                <StatusPill status={a.status} />
              </div>
              <p className="mt-3 text-ink/75 leading-relaxed max-w-3xl">{a.purpose}</p>
              <p className="mt-4 font-mono text-[10px] text-ink3">{a.file}</p>
            </div>
          </article>
        ))}
      </div>

      {/* OUTPUT-GENERATOREN */}
      <section className="brutal-bg-light border-t-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
          <h2 className="h-brutal-sm text-ink">
            Nach der Pipeline: die <em className="italic-accent text-burgundy">Deliverables</em>.
          </h2>
          <p className="mt-4 text-ink/65 max-w-3xl">
            Sobald der Reporter gebündelt hat, machen drei Module daraus, was am Ende herauskommt.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
            {[
              { t: "Excel", b: "Mehrere Tabellenblätter: Zusammenfassung, Wirtschaftlichkeit, Use-Cases, Tools, Roadmap." },
              { t: "Präsentation", b: "Ein Foliensatz mit den Kernpunkten — für die Runde, die entscheidet." },
              { t: "PDF-Report", b: "Der Voll-Bericht — Cover plus alle Abschnitte, sauber zum Mitnehmen." },
            ].map((p) => (
              <div key={p.t} className="bg-paper p-7">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">Output</p>
                <h3 className="font-display text-xl text-ink mt-2">{p.t}</h3>
                <p className="text-sm text-ink/70 mt-2">{p.b}</p>
              </div>
            ))}
          </div>
          <p className="mt-10">
            <Link href="/" className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy hover-slide">
              ← zurück zur Startseite
            </Link>
          </p>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
