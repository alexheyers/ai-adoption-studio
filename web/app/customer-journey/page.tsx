"use client";

import Link from "next/link";
import { EditorialHeader } from "@/components/Layout";

const PHASES = [
  {
    id: "phase-0",
    num: "00",
    title: "Awareness",
    subtitle: "Wie der Kunde von uns erfährt",
    duration: "Variabel",
    persona: "Mittelständischer Hotelier, 45–60, kennt KI nur aus Schlagzeilen",
    user_view: "Sieht einen LinkedIn-Post, BIZ 26 Pitch oder Empfehlung aus dem Branchenkreis. Erstes Interesse: \"Was würde KI in meinem Haus eigentlich wirklich bringen?\"",
    options: [
      { label: "Direkter LinkedIn-Klick", note: "Persönliches Branding Alex/BIZ 26" },
      { label: "BIZ 26 Sales-Call", note: "Berater-vermitteltes Onboarding" },
      { label: "Bootcamp-Demo", note: "Trainer/Peer-Empfehlung" },
      { label: "Empfehlung Branchen-Kreis", note: "Word-of-mouth, höchste Trust-Quote" },
    ],
    tech: "Eingangs-Quelle wird über UTM-Parameter erfasst (kommt in P3).",
    color: "bg-ink/5",
  },
  {
    id: "phase-1",
    num: "01",
    title: "Landing",
    subtitle: "Erste 30 Sekunden auf der Plattform",
    duration: "30–90 Sek",
    persona: "Skeptisch, ungeduldig. Will in 3 Sätzen verstehen, was hier passiert.",
    user_view: "Sieht Hero-Headline \"Wo macht KI für Ihr Haus wirklich Sinn?\", 3-Schritte-Erklärung darunter, CTA \"Analyse starten\". Klar: 30 Min Voice + 8 Agents + Hospitality-Fokus.",
    options: [
      { label: "Direkt starten", note: "→ /login (häufigster Pfad)" },
      { label: "Wieder rausgehen", note: "Tracking via GA4/Plausible (P3)" },
      { label: "Mehr lesen", note: "Kommt: /pricing, /how-it-works" },
    ],
    tech: "Static-Page, kein Backend-Hit. Render via Next.js Static.",
    color: "bg-cream",
  },
  {
    id: "phase-2",
    num: "02",
    title: "Authentifizierung",
    subtitle: "Magic-Link statt Passwort-Pein",
    duration: "1–2 Min",
    persona: "Will keinen weiteren Account anlegen. \"Bitte nicht schon wieder ein Passwort merken.\"",
    user_view: "Gibt Name + E-Mail ein. Bekommt Magic-Link per Mail, klickt ihn an, ist drin. Kein Passwort, keine 2FA-Bürde im MVP.",
    options: [
      { label: "Magic-Link (Standard)", note: "Supabase Auth + eigener Mailer" },
      { label: "Google OAuth (geplant P3)", note: "Für Branchen-Pros mit Google-Workspace" },
      { label: "Berater-Invite-Link (geplant P3)", note: "BIZ-26-Sales legt User vor, Kunde klickt rein" },
    ],
    tech: "Supabase Auth · JWT mit 1h Lifetime · Refresh via SSR-Cookies (App Router).",
    color: "bg-ink/5",
  },
  {
    id: "phase-3",
    num: "03",
    title: "Onboarding · 3 Steps",
    subtitle: "Profil → Daten → Pfad-Wahl",
    duration: "5–10 Min",
    persona: "Bereit zu investieren, aber will sehen, dass die Plattform den Kontext versteht.",
    user_view: "Step 1: Profil + Firma + Pain Points (Freitext). Step 2: Optional Dokumente hochladen (G&V, Personal, KPI, Prozess-Docs — PDF/Excel/CSV/DOCX). Step 3: Pfad-Wahl Self-Service oder Berater-begleitet.",
    options: [
      { label: "Self-Service-Pfad", note: "User führt Voice-Interview selbstständig (MVP-Fokus)" },
      { label: "Berater-begleitet (P3)", note: "BIZ-26-Berater sitzt live im Call dabei" },
      { label: "Kein Dokumenten-Upload", note: "Ada arbeitet rein mit Onboarding-Daten" },
      { label: "Voll-Upload (≤50 MB pro Datei)", note: "Parser extrahiert KPIs automatisch (PDF/Excel)" },
    ],
    tech: "POST /onboarding · POST /upload (multipart) · Supabase Storage Bucket \"documents\" mit RLS pro Company-ID.",
    color: "bg-cream",
  },
  {
    id: "phase-4",
    num: "04",
    title: "Vorbereitung im Hintergrund",
    subtitle: "Web-Research · Doc-Parsing · Pre-Brief",
    duration: "60–120 Sek (parallel)",
    persona: "Wartet aufmerksam. Sieht: \"Ada bereitet sich vor — Web-Research läuft.\"",
    user_view: "Lade-Bildschirm zeigt \"Vorbereitung läuft\". Im Hintergrund: Web-Research-Agent recherchiert Firma online + Region-Benchmarks. Document-Parser extrahiert Klartext + KPIs. Pre-Brief-Builder selektiert 13 von 105 Master-Fragen passend zur Firma.",
    options: [
      { label: "Web-Research aktiv", note: "Anthropic Server-Side Web-Search, ≤6 Suchen" },
      { label: "Web-Research skip (kein Anthropic-Tier?)", note: "Fallback: nur Onboarding-Daten" },
      { label: "13 Fragen aus 105er-Pool", note: "Trigger-basiert (sub_segment, size_class, pains)" },
      { label: "Manuelle Frage-Override (geplant P3)", note: "Berater kann Pool kuratieren" },
    ],
    tech: "BackgroundTask in FastAPI · Web-Research schreibt in web_research-Tabelle · Doc-Parser füllt documents.parsed_text + extracted_kpis.",
    color: "bg-ink/5",
  },
  {
    id: "phase-5",
    num: "05",
    title: "Voice-Interview mit Ada",
    subtitle: "30 Min Senior-Coach-Gespräch",
    duration: "Bis zu 30 Min · Cap bei 28",
    persona: "Skeptisch ob's funktioniert. Wird in 30 Sek warm, wenn Ada den Vornamen + Firma kennt.",
    user_view: "Ada begrüßt mit Vornamen. Stellt 12–15 dynamisch ausgewählte Fragen mit max 3 Folgefragen pro Thema. Bei Minute 25 leitet sie zum Abschluss. Kein Vertriebs-Sprech, kein Bullshit — Coach auf Augenhöhe.",
    options: [
      { label: "Deutsche, weibliche Voice (Standard)", note: "ElevenLabs Default-Stimme · Custom-Voice in P5 trainierbar" },
      { label: "Andere Sprache (geplant P5+)", note: "EN/AT/CH für Internationalisierung" },
      { label: "Pause + später fortsetzen (geplant P3)", note: "Session-Recovery via Supabase" },
      { label: "Manuelles Transcript (Demo-Modus)", note: "Aktuell im MVP; Production via ElevenLabs Webhook" },
    ],
    tech: "POST /voice/start → Pre-Brief + signed_url von ElevenLabs · Frontend connectet direkt via WebRTC · POST /voice/finish persistiert Transcript.",
    color: "bg-cream",
  },
  {
    id: "phase-6",
    num: "06",
    title: "Multi-Agent-Analyse",
    subtitle: "8 Agents · 2–4 Min Pipeline",
    duration: "2–4 Min",
    persona: "Hat 30 Min gesprochen, will jetzt Antworten sehen. Wenig Geduld für \"please wait\".",
    user_view: "Live-Status-Page zeigt Agent-Progress: Process-Auditor ✓, Use-Case-Generator ✓, Tool-Recommender ✓, ROI-Calculator ✓, Compliance-Checker, Roadmap-Generator, Reporter aggregiert. Auto-Refresh alle 2,5 Sek.",
    options: [
      { label: "Volle 8-Agent-Pipeline", note: "Standard für MVP" },
      { label: "Skip einzelner Agents (geplant P4)", note: "z.B. ohne Compliance bei reinem Inhouse-Pilot" },
      { label: "Re-Run mit anderen Parametern (geplant P4)", note: "What-if-Analysen" },
      { label: "Berater-Override (geplant P3)", note: "Berater kann Agent-Outputs kuratieren vor Versand" },
    ],
    tech: "POST /run/start → BackgroundTask im pipeline_runner · Pro Agent eine Zeile in run_results · current_step-Tracking für Polling.",
    color: "bg-ink/5",
  },
  {
    id: "phase-7",
    num: "07",
    title: "Report & Deliverables",
    subtitle: "Executive Summary + Drill-Down + Downloads",
    duration: "Sofort + 24h Mail-Follow-Up",
    persona: "Will erstmal 3 Zahlen sehen: Investment, Savings, Payback. Drill-Down nur wenn die stimmen.",
    user_view: "Executive Summary oben (3–4 Sätze). Darunter: Prozess-Audit, Top Use-Cases, Tool-Empfehlungen, ROI-Box, Roadmap-3-Phasen-Cards, Compliance-Flags mit Disclaimer. Buttons: PPTX, Excel, PDF Download.",
    options: [
      { label: "PPTX Pitch-Deck", note: "Voll im MVP — python-pptx Templates (kommt in P5)" },
      { label: "Excel ROI-Sheet", note: "Voll im MVP — openpyxl (kommt in P5)" },
      { label: "PDF Voll-Report", note: "Funktional im MVP — WeasyPrint (kommt in P5)" },
      { label: "Notion-Export (geplant Phase 2)", note: "Direkt in Kunden-Notion-Workspace" },
      { label: "Berater-Termin buchen (geplant P3)", note: "Calendly/Notion-Integration" },
    ],
    tech: "GET /run/{id} liefert run + alle Agent-Outputs · Report-Page rendert mit Live-Polling bis status='completed'.",
    color: "bg-cream",
  },
  {
    id: "phase-8",
    num: "08",
    title: "Follow-Up & Loyalität",
    subtitle: "E-Mail + Re-Run + Upsell",
    duration: "Tage bis Monate",
    persona: "Hat den Report gelesen. Frage: \"Was jetzt — alleine umsetzen oder Hilfe holen?\"",
    user_view: "E-Mail mit Report-Link + nächsten Schritten. Re-Run-Option in 3 Monaten zum Vergleich. Case-Study-Material für Bewerbungs-Portfolio.",
    options: [
      { label: "Self-Implement", note: "Pilot-Haus setzt Roadmap selbst um" },
      { label: "Berater-Begleitung", note: "Bei Bedarf · Senior-Beratung in Hospitality-Digitalisierung" },
      { label: "Re-Run nach 3 Monaten", note: "Delta-Analyse — was wurde umgesetzt, was hat gewirkt" },
      { label: "Case-Study-Doku", note: "Mit Hotel-Einverständnis · Anonymisierung möglich · Bewerbungs-Portfolio" },
    ],
    tech: "Re-Run-Logik mit Snapshot-Vergleich · automatische Anonymisierung für Case-Studies · Sharing-Mechanismus für LinkedIn-Posts.",
    color: "bg-ink/5",
  },
];

export default function CustomerJourneyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <EditorialHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <p className="text-sm uppercase tracking-widest text-teal mb-3">Customer Journey</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink mb-4 max-w-3xl">
          Vom ersten LinkedIn-Klick bis zum implementierten Use-Case
        </h1>
        <p className="text-lg text-ink/70 max-w-2xl leading-relaxed">
          9 Phasen. Jede mit User-Sicht, Optionen, technischem Hintergrund. So sieht ein Mittelständler im
          Hospitality den Weg durch das AI-Adoption-Studio.
        </p>
      </section>

      {/* Phase-Karte / Übersicht */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {PHASES.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="card flex flex-col items-center text-center py-4 hover:border-teal/40 transition">
              <span className="text-xs text-ink/40">{p.num}</span>
              <span className="text-xs font-medium mt-1">{p.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Phasen detailliert */}
      <div className="mx-auto max-w-7xl px-6 pb-20 space-y-8">
        {PHASES.map((p, i) => (
          <PhaseCard key={p.id} phase={p} index={i} />
        ))}
      </div>

      {/* Pfad-Varianten ohne Pricing-Tier-Sprache */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-6">Pfad-Varianten auf einen Blick</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-ink/60 border-b border-ink/10">
              <tr>
                <th className="py-3 pr-4">Pfad</th>
                <th className="py-3 pr-4">Onboarding</th>
                <th className="py-3 pr-4">Daten-Upload</th>
                <th className="py-3 pr-4">Voice</th>
                <th className="py-3 pr-4">Begleitung</th>
                <th className="py-3 pr-4">Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <tr>
                <td className="py-3 pr-4 font-medium">Quick-Test</td>
                <td className="py-3 pr-4">Self-Service</td>
                <td className="py-3 pr-4">Skip</td>
                <td className="py-3 pr-4">15 Min</td>
                <td className="py-3 pr-4">—</td>
                <td className="py-3 pr-4">PDF Light</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Voll-Analyse</td>
                <td className="py-3 pr-4">Self-Service</td>
                <td className="py-3 pr-4">2–3 Dateien</td>
                <td className="py-3 pr-4">30–40 Min</td>
                <td className="py-3 pr-4">—</td>
                <td className="py-3 pr-4">PPTX + Excel + PDF</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Berater-Begleitet</td>
                <td className="py-3 pr-4">Berater-Invite</td>
                <td className="py-3 pr-4">Voll (G&V, Personal, KPIs)</td>
                <td className="py-3 pr-4">30–40 Min mit Berater live</td>
                <td className="py-3 pr-4">Alex Heyers · Senior-Berater</td>
                <td className="py-3 pr-4">PPTX + Excel + PDF + Notion-Workspace</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Re-Run (3 Mo)</td>
                <td className="py-3 pr-4">Auto-prefill</td>
                <td className="py-3 pr-4">Updates</td>
                <td className="py-3 pr-4">15 Min Delta-Interview</td>
                <td className="py-3 pr-4">Optional</td>
                <td className="py-3 pr-4">Vergleichs-Report</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech-Architektur */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-6">Tech-Architektur (für die Neugierigen)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Frontend</h3>
            <ul className="text-sm text-ink/70 space-y-1 list-disc pl-5">
              <li>Next.js 14 (App Router)</li>
              <li>Tailwind + shadcn-Ästhetik</li>
              <li>TanStack Query</li>
              <li>Supabase SSR-Client</li>
              <li>ElevenLabs React SDK (WebRTC)</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Backend</h3>
            <ul className="text-sm text-ink/70 space-y-1 list-disc pl-5">
              <li>Python 3.11+ · FastAPI</li>
              <li>17 REST-Endpoints</li>
              <li>JWT-Verify gegen Supabase</li>
              <li>BackgroundTasks für Pipeline</li>
              <li>Anthropic SDK + ElevenLabs SDK</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Daten & KI</h3>
            <ul className="text-sm text-ink/70 space-y-1 list-disc pl-5">
              <li>Supabase Postgres (7 Tabellen, RLS)</li>
              <li>Supabase Storage (Bucket "documents")</li>
              <li>Claude Sonnet 4.6 (Agents)</li>
              <li>GPT-4V (Doc-Parsing Backup)</li>
              <li>ElevenLabs Conversational AI</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-ink/50 flex justify-between">
          <span>AI-Adoption-Studio · Customer Journey · v0.1 (MVP)</span>
          <span>2026-05-11</span>
        </div>
      </footer>
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: typeof PHASES[number]; index: number }) {
  return (
    <section id={phase.id} className={`scroll-mt-24 rounded-3xl border border-ink/10 ${phase.color} p-8 md:p-10`}>
      <div className="grid md:grid-cols-[120px_1fr] gap-6">
        <div className="text-teal">
          <div className="text-5xl font-semibold tracking-tight">{phase.num}</div>
          <div className="mt-2 text-xs uppercase tracking-widest text-ink/50">{phase.duration}</div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{phase.title}</h2>
          <p className="text-ink/60 text-base mt-1">{phase.subtitle}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-teal mb-2">Persona</p>
              <p className="text-sm text-ink/80">{phase.persona}</p>
              <p className="text-xs uppercase tracking-widest text-teal mt-5 mb-2">User-Sicht</p>
              <p className="text-sm leading-relaxed">{phase.user_view}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-teal mb-2">Optionen / Varianten</p>
              <ul className="space-y-2">
                {phase.options.map((o) => (
                  <li key={o.label} className="text-sm">
                    <span className="font-medium">→ {o.label}</span>
                    <span className="block text-xs text-ink/60 ml-4">{o.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-ink/5 px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Tech-Hintergrund</p>
            <p className="text-xs text-ink/70 font-mono">{phase.tech}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
