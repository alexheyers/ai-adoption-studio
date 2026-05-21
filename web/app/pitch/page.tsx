"use client";

import Link from "next/link";
import Image from "next/image";
import { EditorialHeader } from "@/components/Layout";

/**
 * Pitch-Deck · 19. Mai 2026 · Editorial × Quiet Luxury.
 * Long-Scroll-Page mit ~12 Slide-Sektionen.
 * Druckbar via Cmd+P → Querformat → Hintergrundgrafiken AN.
 */

const TODAY = "15. Mai 2026";
const PITCH_DATE = "19. Mai 2026";
const FINAL_PITCH = "21. Juli 2026";
const PITCH_LABEL = "Konzept-Pitch";

export default function PitchPage() {
  return (
    <div className="bg-paper">
      <PrintCSS />
      <EditorialHeader />

      {/* ── 01 · COVER ─────────────────────────────────────── */}
      <Slide bg="bg-ink" className="text-paper">
        <div className="grid grid-cols-12 gap-x-6 w-full h-full">
          {/* Linke Spalte: Masthead */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/60">
              <span>Vol. I · No. 01</span>
              <span className="hidden md:inline">{PITCH_LABEL} · B05-05</span>
              <span>{PITCH_DATE}</span>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">
                Hospitality-Strategie · KI-Dekade
              </p>
              <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] text-paper"
                  style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144' }}>
                AI-Adoption<br />
                <span className="italic text-gold"
                      style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}>
                  Studio.
                </span>
              </h1>
              <p className="mt-10 text-2xl text-paper/80 max-w-2xl leading-snug">
                Multi-Agent-System mit Voice-Coach für KI-Adoptions-Beratung im Hospitality-Mittelstand.
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6 pt-10 border-t border-paper/20 font-mono text-[10px] tracking-eyebrow uppercase text-paper/60">
              <div>
                <p className="text-paper">Alex Heyers</p>
                <p>Mosbach · DACH</p>
              </div>
              <div className="text-right">
                <p>20 Jahre · Gastronomie → Digital → KI</p>
                <p>Vibe Coding Bootcamp</p>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: vertikales Eyebrow */}
          <div className="hidden lg:flex col-span-5 items-end justify-end">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/40 rotate-90 origin-bottom-right">
              Senior-Beratung im 30-Min-Format
            </p>
          </div>
        </div>
      </Slide>

      {/* ── 02 · DAS PROBLEM ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="01" label="Befund" />
        <H>Warum 80 % der Mittelstands-<em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>KI</em>-Strategien Papier bleiben.</H>
        <div className="mt-16 grid md:grid-cols-3 gap-px bg-ink/15 border-y border-ink/15">
          <ProblemCell roman="i." title="Generisch" body="Sechzig Seiten Buzzwords aus Template. Ihr Haus, Ihre Region, Ihr Wettbewerb — nie genannt." />
          <ProblemCell roman="ii." title="Zu teuer" body="15.000 bis 80.000 €. Mittelständler unterschreibt mit Bauchschmerzen — und hat keinen Use-Case live." />
          <ProblemCell roman="iii." title="Zu langsam" body="6 bis 12 Wochen bis zum Vorschlag. Der KI-Markt dreht sich in dieser Zeit zweimal." />
        </div>
        <Punchline>
          Acht von zehn Hospitality-Häusern haben "KI" in der 2026-Strategie. Null Use-Cases im Betrieb.
        </Punchline>
      </Slide>

      {/* ── 03 · LÖSUNG ─────────────────────────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="02" label="Vorschlag" />
        <H>30 Minuten Voice. <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>8</em> Agents. 24 Stunden bis zum Pitch-Deck.</H>
        <div className="mt-16 grid md:grid-cols-3 gap-px bg-ink/15">
          <StatCell value="30" unit="Minuten" label="Voice-Interview mit Ada · deutsch-sprachiger Voice-Coach" />
          <StatCell value="8" unit="Agents" label="Spezialisten · seriell + parallel orchestriert" accent />
          <StatCell value="24" unit="Stunden" label="bis Pitch-Deck · ROI-Excel · PDF im Postfach" />
        </div>
        <p className="mt-16 max-w-4xl text-2xl text-ink2 leading-snug">
          Statt sechs Wochen Berater-Beratung: ein Voice-Gespräch wie mit einem erfahrenen Kollegen aus der Branche — und ein Multi-Agent-System, das daraus konkrete, mit Zahlen unterlegte Empfehlungen baut.
        </p>
      </Slide>

      {/* ── 04 · CUSTOMER JOURNEY ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="03" label="Mechanik" />
        <H>Sieben Stationen vom Klick zum Pitch-Deck.</H>
        <ol className="mt-16 grid grid-cols-7 gap-px bg-ink/15 border-y border-ink/15">
          {[
            ["01", "Landing", "30 Sek"],
            ["02", "Login", "1 Min"],
            ["03", "Onboarding", "5 Min"],
            ["04", "Web-Research", "Auto"],
            ["05", "Voice mit Ada", "30 Min"],
            ["06", "8 Agents", "3 Min"],
            ["07", "Deliverables", "Sofort"],
          ].map(([n, t, d]) => (
            <li key={n} className="bg-paper p-5">
              <p className="font-mono text-burgundy text-[10px] tracking-eyebrow">{n}</p>
              <p className="font-display text-xl text-ink leading-tight mt-2">{t}</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-3">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-lg text-ink2 max-w-3xl leading-relaxed">
          Web-Research-Agent kennt das Haus, bevor Ada den ersten Satz spricht. Ada hört zu, fragt nach, fasst zusammen — ein deutsches Gespräch auf Augenhöhe. Danach laufen sieben Agents: Prozess-Audit, Use-Cases, Tools, ROI, Compliance, Roadmap, Reporter.
        </p>
        <p className="mt-6">
          <Link href="/customer-journey" className="link-editorial font-mono text-[11px] tracking-eyebrow uppercase print:hidden">
            Volle Customer Journey →
          </Link>
        </p>
      </Slide>

      {/* ── 05 · AGENTS ─────────────────────────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="04" label="Spezialisten" />
        <H>Acht Senior-Berater im Mini-Format.</H>
        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-5">
          {[
            ["Web-Research", "Recherchiert Firma online und Stadt-Benchmarks, bevor Ada das Gespräch beginnt."],
            ["Process-Auditor", "Identifiziert die zeitfressenden Prozesse und ihre Automatisierungs-Potenziale."],
            ["Use-Case-Generator", "Übersetzt Pain Points in konkrete Anwendungsfälle mit Quick-Win-Flag."],
            ["Tool-Recommender", "Empfiehlt Tools, vergleicht Alternativen, schätzt Monatskosten und Setup."],
            ["ROI-Calculator", "Investment, Savings, Payback-Monate, 3-Jahres-ROI pro Use-Case."],
            ["Compliance-Checker", "DSGVO-Bewertung + EU-AI-Act-Risikoklasse + Branchen-Hinweise."],
            ["Roadmap-Generator", "Drei Phasen über zwölf Monate. Critical Path. Dependencies sichtbar."],
            ["Reporter", "Aggregiert alles zur Executive Summary, die ein CEO in 30 Sek liest."],
          ].map(([name, desc]) => (
            <div key={name as string} className="border-l-2 border-burgundy pl-5 py-2">
              <p className="font-display text-xl text-ink leading-tight">{name}</p>
              <p className="text-sm text-ink2 mt-2 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* ── 06 · WORKFLOWS · INTRO ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="05" label="Live · auf dem VPS deployed" />
        <H>Vier Prozesse. Vier <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Workflows</em>.<br />Live im n8n.</H>
        <p className="mt-6 text-lg text-ink2 max-w-3xl leading-relaxed">
          Keine Mockups, keine Folien-Demos. Die folgenden vier n8n-Workflows laufen heute auf dem VPS — gegen Claude-Sonnet-4.5, mit Slack-Touchpoint, Audit-Trail, Confidence-Thresholds. Jeder Workflow adressiert einen konkreten Hospitality-Prozess. Public Source-Anker neben jeder Behauptung. Keine erfundenen Zahlen.
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border-y border-ink/15">
          <WorkflowOverviewCell num="01" name="Reservation-Triage" nodes="18" status="live" desc="Mail-Klassifikation + Slack-Fanout" />
          <WorkflowOverviewCell num="02" name="Document-Analyst" nodes="15" status="live" desc="PDF/CSV/XLSX → strukturierte KPIs" />
          <WorkflowOverviewCell num="03" name="Voice-Discovery" nodes="12" status="building" desc="30-Min-Interview → Notion + Slack" />
          <WorkflowOverviewCell num="04" name="Multi-Agent-Report" nodes="13 + 5 Subs" status="building" desc="Master orchestriert 5 Sub-Agents" />
        </div>
      </Slide>

      {/* ── 07 · WORKFLOW 1 · RESERVATION-TRIAGE ───────────────────── */}
      <Slide>
        <Eyebrow num="06" label="Workflow · 01 · Reservation-Triage" />
        <H>Samstag, 09:00 Uhr. Die <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Inbox</em> sortiert sich selbst.</H>

        <div className="mt-12 grid lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-5 space-y-8">
            <BeforeAfter
              before="Mensch im Front-Office liest jede Mail, sortiert mental, antwortet einzeln. Antwortzeit Gruppen-Anfragen: 6–14 Stunden, je nach Wochenende."
              after="Triage-Agent klassifiziert in drei Buckets (Buchung · Beschwerde · Info) mit Confidence-Score. Mensch sichtet vor-erstellte Antwort + sendet."
              human="Final-Sichtung jeder Antwort · Beziehungs-Touchpoints · Beschwerde-Eskalationen"
            />
            <SourceAnchor
              claim="Studien aus vergleichbaren Service-Workflows zeigen 50–70 % Volumen-Reduktion in der menschlichen Bearbeitungszeit."
              source="Klarna AI Assistant · Feb 2024 (öffentliche Pressemitteilung) · 2,3 Mio Customer-Service-Conversations im ersten Monat = Volumen von 700 Full-Time-Agents"
            />
            <WorkflowBadge id="CU6Icsv7F5bYLNyY" status="live" lastDeploy="15.05.2026" />
          </div>
          <div className="lg:col-span-7">
            <WorkflowDiagram src="/wf1-reservation-triage.png" alt="n8n Workflow: Reservation-Triage" caption="n8n-Workflow · 18 Nodes · Webhook → Triage-Agent (Claude + Memory + 3 Tools) → Confidence-Branch → Switch (3 Buckets) → 4 Slack-Channels + Audit" />
          </div>
        </div>
      </Slide>

      {/* ── 08 · WORKFLOW 2 · DOCUMENT-ANALYST ─────────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="07" label="Workflow · 02 · Document-Analyst" />
        <H>Lieferanten-Belege. <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Selbst gelesen.</em></H>

        <div className="mt-12 grid lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-5 space-y-8">
            <BeforeAfter
              before="Manuelle Eingabe pro Beleg. DATEV-Studien zeigen 8–12 Minuten je Beleg im Mittel. Freitags fest blockiert in der Buchhaltung."
              after="Upload (PDF/CSV/XLSX) → Switch nach Dateityp → OCR/Parser → Document-Analyst extrahiert KPIs (Belegung · ADR · RevPAR · OTA-Anteil) → Supabase mit Confidence-Score."
              human="Sichtung Confidence < 0,9 · Anomalien · neue Lieferanten-Formate · Verhandlungs-Themen"
            />
            <SourceAnchor
              claim="OCR-Industrie-Benchmarks öffentlich dokumentiert mit 90–95 % Genauigkeit auf strukturierten Belegen."
              source="Rossum, Klippa, Veryfi · Produkt-Whitepaper + Gartner Magic Quadrant for Document AI · Industrie-Konsens"
            />
            <WorkflowBadge id="i3y8xEJoCh8qdiTD" status="live" lastDeploy="15.05.2026" />
          </div>
          <div className="lg:col-span-7">
            <WorkflowDiagram src="/wf2-document-analyst.png" alt="n8n Workflow: Document-Analyst" caption="n8n-Workflow · 15 Nodes · Webhook → Switch (Dateityp) → 3 Parser-Pfade → Merge → Document-Analyst (Claude + 2 Tools) → Confidence-Branch → Supabase + Slack-Pipeline" />
          </div>
        </div>
      </Slide>

      {/* ── 09 · WORKFLOW 3 · VOICE-DISCOVERY ──────────────────────── */}
      <Slide>
        <Eyebrow num="08" label="Workflow · 03 · Voice-Discovery" />
        <H>Dreißig Minuten <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Gespräch</em>. Asynchron.</H>

        <div className="mt-12 grid lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-5 space-y-8">
            <BeforeAfter
              before="1–3 Berater-Workshops à 2–4 Stunden. Reise-Zeit, Folien-Vorbereitung, mehrere Termine zur Daten-Gewinnung. Branchen-Standard: 15–80 T€ Audit-Honorar."
              after="Voice-Upload (DE) → ElevenLabs Transcription → Interview-Analyst prüft Pre-Audit-Hypothesen + extrahiert Pain-Signals → Notion-Eintrag + Slack-Summary."
              human="Direktor bleibt 30 Min im Gespräch · Tool führt strukturiert"
            />
            <SourceAnchor
              claim="Sprechen liefert ~3,5× höhere Informationsdichte pro Zeit als Tippen. Strukturierte Voice-Interviews zeigen höhere Datentiefe und weniger Drop-outs."
              source="NASA HCI Literature (150 WPM gesprochen vs. ~40 WPM getippt) · Stanford CHI 2021 zu Voice-vs-Text-Interviews · BDU Branchen-Reports zu Senior-Audit-Honoraren"
            />
            <WorkflowBadge id="N9PTvl7OqKuJIrBe" status="building" lastDeploy="15.05.2026" />
          </div>
          <div className="lg:col-span-7">
            <WorkflowDiagram src="/wf3-voice-discovery.png" alt="n8n Workflow: Voice-Discovery" caption="n8n-Workflow · 12 Nodes · Voice-Upload → ElevenLabs (DE-Transcription) → Interview-Analyst (Claude + Memory + 2 Hypothesen-Tools) → Notion + Slack parallel → Merge" />
          </div>
        </div>
      </Slide>

      {/* ── 10 · WORKFLOW 4 · MULTI-AGENT-REPORT ───────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="09" label="Workflow · 04 · Multi-Agent-Report" />
        <H>Fünf <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>Spezialisten</em>. Parallel. Ein Bericht.</H>

        <div className="mt-12 grid lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-5 space-y-8">
            <BeforeAfter
              before="Beratungs-Empfehlungen brauchen 4–8 Wochen Schreib-Zeit. Workshops, interne Drafts, Stakeholder-Loops. Übergabe nach 6–12 Wochen."
              after="Master orchestriert fünf Sub-Workflows parallel: Process-Auditor · Use-Case-Generator (VUFVE) · Tool-Recommender (TSE/DSGVO) · ROI-Calculator · Compliance-Checker. Aggregation → Reporter-Agent verdichtet zu Executive Summary."
              human="Ich schärfe vor Auslieferung · Direktor entscheidet vor Umsetzung"
            />
            <SourceAnchor
              claim="Generative-AI-Assistenz in dokumentenbasierten Wissens-Workflows zeigt 25–50 % Produktivitätssteigerung — bei strukturierten Schreib-Aufgaben 30–55 % schnellere Fertigstellung."
              source="Goldman Sachs Report März 2023 · GitHub Copilot Productivity Study (Microsoft Research 2022) · McKinsey 'Economic Potential of Generative AI' Juni 2023"
            />
            <WorkflowBadge id="b6nqaVQU4ka0JPr8" status="building" lastDeploy="15.05.2026" />
          </div>
          <div className="lg:col-span-7">
            <WorkflowDiagram src="/wf4-multi-agent-report.png" alt="n8n Workflow: Multi-Agent-Report Master" caption="n8n-Master-Workflow · 13 Nodes + 5 deployed Sub-Workflows · Webhook fanout → 5× ExecuteWorkflow parallel → Merge → Reporter-Agent (Claude) → PDF → Postgres + Slack" />
          </div>
        </div>
      </Slide>

      {/* ── 07 · MARKT ─────────────────────────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="06" label="Markt" />
        <H>Wo der Schmerz konkret sitzt.</H>
        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-12">
          <div>
            <p className="eyebrow-ink">Zielgruppe MVP</p>
            <ul className="mt-6 space-y-4 text-lg text-ink2">
              <Bullet>Hospitality DACH · S/M-Größenklasse · 26-250 Mitarbeitende</Bullet>
              <Bullet>Boutique-Hotels, Familienbetriebe, Tagungshotels · oft inhabergeführt, knappe Tech-Ressourcen</Bullet>
              <Bullet>Gastronomie · Kassen-TSE, HACCP, Wareneinsatz — alle drei reif für Automation</Bullet>
            </ul>
          </div>
          <div>
            <p className="eyebrow-ink">Marktgröße DACH</p>
            <ul className="mt-6 space-y-4 text-lg text-ink2">
              <Bullet>~50.000 Hotelbetriebe</Bullet>
              <Bullet>~250.000 Restaurants und Bars</Bullet>
              <Bullet>3,5 % mit konkreter KI-Strategie · 0,8 % mit produktivem Use-Case</Bullet>
              <Bullet><strong>SAM:</strong> ~15.000 Betriebe · <strong>~15 Mio € adressierbar</strong></Bullet>
            </ul>
          </div>
        </div>
      </Slide>

      {/* ── 08 · WARUM ICH DAS BAUE ─────────────────────────────────────── */}
      <Slide bg="bg-ink" className="text-paper">
        <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">07 · Career-Strategy</p>
        <h2 className="mt-4 font-display text-display-lg text-paper">
          Warum ich das baue.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">Zwanzig Jahre Branchen-DNA</p>
            <p className="text-lg text-paper/85 leading-relaxed">
              Vom Service-Beruf an der Bar über Standort-Leitung bis in die Direktion. Ich kenne die Realität in Hotels — Personalmangel, OTA-Druck, schlechte Antwortzeiten, Reservierungs-Mail-Berg. Aus dieser Position heraus baue ich, was ich selber lange gebraucht hätte.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">Nach dem Bootcamp · ab August 2026</p>
            <p className="text-lg text-paper/85 leading-relaxed">
              Aktive Bewerbung bei Digital-Agenturen und Beratungen mit Hospitality-Vertical. Dieses Studio ist mein Work-Sample · es zeigt Full-Stack-Fähigkeit, Senior-Consultant-Methode in Code übersetzt und tiefes Branchen-Verständnis. Vollzeit oder Senior-Freelance · DACH-Region.
            </p>
          </div>
        </div>
        <p className="mt-16 font-mono text-[11px] tracking-eyebrow uppercase text-gold max-w-3xl">
          Pilot-Hotels für Case-Studies bis 21. Juli — Final-Pitch zeigt drei reale Cases · keine Produktverkäufe, sondern Belege für die Bewerbungsphase
        </p>
      </Slide>

      {/* ── 09 · TECH-STACK ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="08" label="Stack" />
        <H>Stack, der heute schon läuft.</H>
        <div className="mt-16 grid md:grid-cols-3 gap-px bg-ink/15 border-y border-ink/15">
          <TechCard
            title="Frontend"
            items={["Next.js 14 · App Router", "Tailwind · Editorial-Theme", "TanStack Query", "Supabase SSR-Client", "ElevenLabs React SDK"]}
          />
          <TechCard
            title="Backend"
            items={["Python 3.11+ · FastAPI", "17 REST-Endpoints", "JWT-Verify gegen Supabase", "BackgroundTasks Pipeline", "Anthropic + ElevenLabs SDK"]}
          />
          <TechCard
            title="Daten & KI"
            items={["Supabase Postgres · 7 Tabellen · RLS", "Supabase Storage", "Claude Sonnet 4.6 · 8 Agents", "ElevenLabs Conversational AI", "WeasyPrint · python-pptx · openpyxl"]}
          />
        </div>
      </Slide>

      {/* ── 10 · STATUS / ROADMAP ─────────────────────────────────────── */}
      <Slide bg="bg-paper2">
        <Eyebrow num="09" label="Status" />
        <H>Wo wir heute stehen.</H>
        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-12">
          <div>
            <p className="eyebrow-ink">Heute · {TODAY} · MVP-Code komplett</p>
            <ul className="mt-6 space-y-3 text-base">
              <Check>Supabase-Schema · 7 Tabellen · RLS · 2 Storage-Buckets</Check>
              <Check>FastAPI-Backend · 17 Endpoints · JWT-Auth</Check>
              <Check>8 Multi-Agents inkl. Web-Research, Compliance, Roadmap</Check>
              <Check>105 Master-Fragen · Pre-Brief-Builder · ElevenLabs-Integration</Check>
              <Check>Frontend · Editorial Design · Landing, Auth, Onboarding, Voice, Report</Check>
              <Check>Deliverables-Generator · PPTX + Excel + PDF</Check>
              <Check>Document-Parser · PDF / Excel / CSV / DOCX</Check>
              <Check>End-to-End Smoke-Test gegen echte Claude-API · grün</Check>
            </ul>
          </div>
          <div>
            <p className="eyebrow-ink">Bis {FINAL_PITCH} · Final-Pitch B05-23</p>
            <ul className="mt-6 space-y-4 text-base text-ink2">
              <Bullet><strong>P2 Foundation (20.5.–9.6.):</strong> Vercel + Hostinger-VPS-Deploy. ElevenLabs Voice-Test live.</Bullet>
              <Bullet><strong>P3 Voice-Core (10.6.–30.6.):</strong> 105 Fragen kuratieren, Webhook-Transcript, Persona-Tuning.</Bullet>
              <Bullet><strong>P4 Multi-Agent (1.7.–14.7.):</strong> Production-Niveau, parallele Execution, Caching.</Bullet>
              <Bullet><strong>P5 Polish (15.7.–20.7.):</strong> 3 echte Pilot-Hotels durchgeführt. Demo-Skript.</Bullet>
            </ul>
          </div>
        </div>
      </Slide>

      {/* ── 11 · DEFENSIBILITY ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="10" label="Moats" />
        <H>Warum nicht der nächste Wrapper.</H>
        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-10">
          <Moat
            title="Branchen-DNA"
            detail="20 Jahre Hospitality. Vom Service-Beruf zur Digital-Strategie. Das hört man der Ada an. Generic-LLM-Wrapper können das nicht klonen."
          />
          <Moat
            title="105-Fragen-Master-Pool"
            detail="Trigger-basierte Selektion. Jede Frage hat Kontext, Folgefragen-Tiefe, Branchen-Anker. Iterativ über echte Interviews verfeinert."
          />
          <Moat
            title="8-Agent-Choreografie"
            detail="Nicht ein Mega-Prompt — eine Pipeline mit klaren Outputs, Compliance-Sicherheitsnetzen, überprüfbaren Datenpunkten."
          />
          <Moat
            title="Eigener Kanal"
            detail="Domain-Mix in Eigenregie: deinebusinesspage.de, meinvoiceagent.de, myflowmotion.cloud. Plus DACH-Branchen-Netzwerk aus 20 Jahren Hospitality."
          />
        </div>
      </Slide>

      {/* ── 12 · ASK + NEXT ─────────────────────────────────────── */}
      <Slide bg="bg-ink" className="text-paper">
        <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">11 · Ende</p>
        <h2 className="mt-4 font-display text-display-xl text-paper leading-[0.95]"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 144' }}>
          Was ich von <em className="text-gold italic" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}>euch</em><br />
          hören will.
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">Konkrete Fragen</p>
            <ul className="space-y-4 text-lg text-paper/85">
              <Bullet light>Welche Branchen kämen nach Hospitality?</Bullet>
              <Bullet light>Wer kennt 3 Hotelbetriebe für den Pilot?</Bullet>
              <Bullet light>Wer will Voice-Agent-Polishing bis 21.07.?</Bullet>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">Nächste Termine</p>
            <ul className="space-y-4 text-lg text-paper/85">
              <Bullet light><strong>20.05.</strong> · P2 Foundation startet</Bullet>
              <Bullet light><strong>15.06.</strong> · Erstes Pilot-Hotel-Voice-Test</Bullet>
              <Bullet light><strong>21.07.</strong> · Final-Pitch · mit 3 Pilot-Stories</Bullet>
            </ul>
          </div>
        </div>
        <p className="mt-24 font-display text-display-md text-paper" style={{ fontVariationSettings: '"opsz" 144' }}>
          Danke. <em className="text-gold" style={{ fontVariationSettings: '"WONK" 1' }}>Fragen?</em>
        </p>
        <p className="mt-6 font-mono text-[11px] tracking-eyebrow uppercase text-paper/50">
          a.heyers@gmail.com · Mosbach · Vibe Coding Bootcamp · {TODAY}
        </p>
      </Slide>

      <div className="print:hidden bg-paper2 border-t border-ink/15">
        <div className="mx-auto max-w-[1280px] px-8 py-6 flex items-center justify-between font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
          <span>Print-Tipp: Cmd+P · Querformat · Hintergrundgrafiken AN</span>
          <Link href="/" className="hover:text-burgundy">← zurück zur Landing</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Building Blocks ───────────────────────────────────────── */

function Slide({ children, bg = "bg-paper", className = "" }: { children: React.ReactNode; bg?: string; className?: string }) {
  return (
    <section className={`${bg} ${className} print:break-after-page min-h-screen flex items-center`}>
      <div className="mx-auto max-w-[1280px] w-full px-8 py-20 lg:py-24">
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">
      {num} · {label}
    </p>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-display-lg text-ink leading-[1.0]"
        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144' }}>
      {children}
    </h2>
  );
}

function Punchline({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-12 max-w-3xl pull-quote text-burgundy" style={{ fontStyle: "italic" }}>
      {children}
    </p>
  );
}

function ProblemCell({ roman, title, body }: { roman: string; title: string; body: string }) {
  return (
    <article className="bg-paper p-10">
      <p className="font-display text-burgundy text-2xl italic" style={{ fontVariationSettings: '"WONK" 1' }}>
        {roman}
      </p>
      <h3 className="mt-4 font-display text-3xl text-ink leading-tight">{title}</h3>
      <p className="mt-5 text-ink2 leading-relaxed">{body}</p>
    </article>
  );
}

function StatCell({ value, unit, label, accent = false }: { value: string; unit: string; label: string; accent?: boolean }) {
  return (
    <article className="bg-paper2 p-10 flex flex-col">
      <p className={`font-display text-7xl leading-none ${accent ? "text-burgundy" : "text-ink"}`}
         style={{ fontVariationSettings: '"opsz" 144' }}>
        {value}
      </p>
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-3">{unit}</p>
      <p className="mt-5 text-ink2 text-sm leading-snug">{label}</p>
    </article>
  );
}

function WorkflowOverviewCell({
  num,
  name,
  nodes,
  status,
  desc,
}: {
  num: string;
  name: string;
  nodes: string;
  status: "live" | "building" | "planned";
  desc: string;
}) {
  const statusColor = status === "live" ? "text-sage" : status === "building" ? "text-gold" : "text-ink3";
  const statusLabel = status === "live" ? "Live" : status === "building" ? "In Bau" : "Geplant";
  const statusGlyph = status === "live" ? "✓" : status === "building" ? "◐" : "○";
  return (
    <article className="bg-paper p-8 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">· {num}</p>
        <span className={`inline-flex items-center gap-1 font-mono text-[9px] tracking-eyebrow uppercase ${statusColor}`}>
          <span aria-hidden>{statusGlyph}</span>
          {statusLabel}
        </span>
      </div>
      <p className="mt-6 font-display text-2xl text-ink leading-tight"
         style={{ fontVariationSettings: '"WONK" 1, "opsz" 144' }}>
        <em>{name}</em>
      </p>
      <p className="mt-2 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">{nodes} Nodes</p>
      <p className="mt-6 text-sm text-ink2 leading-relaxed flex-1">{desc}</p>
    </article>
  );
}

function BeforeAfter({
  before,
  after,
  human,
}: {
  before: string;
  after: string;
  human: string;
}) {
  return (
    <div className="border-y border-ink/15">
      <div className="grid grid-cols-12 gap-x-4 py-5 border-b border-ink/10">
        <p className="col-span-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3 pt-1">
          Vorher
        </p>
        <p className="col-span-9 text-sm text-ink2 leading-relaxed">{before}</p>
      </div>
      <div className="grid grid-cols-12 gap-x-4 py-5 border-b border-ink/10">
        <p className="col-span-3 font-mono text-[10px] tracking-eyebrow uppercase text-burgundy pt-1">
          Nachher
        </p>
        <p className="col-span-9 text-sm text-ink leading-relaxed">{after}</p>
      </div>
      <div className="grid grid-cols-12 gap-x-4 py-5">
        <p className="col-span-3 font-mono text-[10px] tracking-eyebrow uppercase text-gold pt-1">
          Mensch
        </p>
        <p className="col-span-9 text-sm text-ink2 leading-relaxed italic">{human}</p>
      </div>
    </div>
  );
}

function SourceAnchor({ claim, source }: { claim: string; source: string }) {
  return (
    <div className="border-l-2 border-burgundy pl-5 py-1">
      <p className="font-display italic text-base text-ink leading-snug"
         style={{ fontVariationSettings: '"WONK" 1' }}>
        {claim}
      </p>
      <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3 leading-relaxed">
        Quelle · {source}
      </p>
    </div>
  );
}

function WorkflowBadge({
  id,
  status,
  lastDeploy,
}: {
  id: string;
  status: "live" | "building";
  lastDeploy: string;
}) {
  const statusColor = status === "live" ? "text-sage" : "text-gold";
  const statusLabel = status === "live" ? "deployed · aktiv-schaltbereit" : "deployed · im Bau";
  return (
    <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono uppercase tracking-eyebrow">
      <span className={`flex items-center gap-1.5 ${statusColor}`}>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
        {statusLabel}
      </span>
      <span className="text-ink3">·</span>
      <span className="text-ink3">n8n-ID: <span className="text-ink">{id}</span></span>
      <span className="text-ink3">·</span>
      <span className="text-ink3">Stand {lastDeploy}</span>
    </div>
  );
}

function WorkflowDiagram({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="bg-paper border border-ink/15 p-4 lg:p-6">
      <div className="relative w-full aspect-[16/10] bg-paper2">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
          unoptimized
        />
      </div>
      <figcaption className="mt-4 text-xs text-ink3 leading-relaxed font-mono">
        {caption}
      </figcaption>
    </figure>
  );
}

function Bullet({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className={light ? "text-gold mt-1" : "text-burgundy mt-1"}>→</span>
      <span className="leading-snug">{children}</span>
    </li>
  );
}

function PriceTier({ name, price, unit, eyebrow, features, highlight = false }:
  { name: string; price: string; unit: string; eyebrow: string; features: string[]; highlight?: boolean }) {
  return (
    <article className={`p-10 flex flex-col ${highlight ? "bg-paper text-ink" : "bg-ink/60 text-paper"}`}>
      <p className={`font-mono text-[10px] tracking-eyebrow uppercase ${highlight ? "text-burgundy" : "text-gold"}`}>
        {eyebrow}
      </p>
      <h3 className={`mt-3 font-display text-3xl leading-tight ${highlight ? "text-ink" : "text-paper"}`}>
        {name}
      </h3>
      <div className="mt-8 flex items-baseline gap-2">
        <span className={`font-display text-6xl leading-none ${highlight ? "text-burgundy" : "text-gold"}`}
              style={{ fontVariationSettings: '"opsz" 144' }}>
          {price}
        </span>
        <span className={`font-mono text-sm ${highlight ? "text-ink3" : "text-paper/60"}`}>{unit}</span>
      </div>
      <ul className={`mt-10 space-y-3 text-sm ${highlight ? "text-ink2" : "text-paper/85"}`}>
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className={highlight ? "text-burgundy" : "text-gold"}>·</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TechCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="bg-paper p-10">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">{title}</p>
      <ul className="mt-6 space-y-3 text-base text-ink2">
        {items.map((i) => <li key={i}>· {i}</li>)}
      </ul>
    </article>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-burgundy mt-0.5">✓</span>
      <span className="leading-snug">{children}</span>
    </li>
  );
}

function Moat({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-l-2 border-burgundy pl-6">
      <h3 className="font-display text-2xl text-ink leading-tight">{title}</h3>
      <p className="mt-3 text-ink2 leading-relaxed">{detail}</p>
    </div>
  );
}

function PrintCSS() {
  return (
    <style jsx global>{`
      @media print {
        body { background: white; }
        nav, header { display: none !important; }
        section { break-after: page; min-height: auto !important; }
      }
    `}</style>
  );
}
