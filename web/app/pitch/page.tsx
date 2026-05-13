"use client";

import Link from "next/link";

/**
 * Pitch-Deck · 19. Mai 2026 · Editorial × Quiet Luxury.
 * Long-Scroll-Page mit ~12 Slide-Sektionen.
 * Druckbar via Cmd+P → Querformat → Hintergrundgrafiken AN.
 */

const TODAY = "11. Mai 2026";
const PITCH_DATE = "19. Mai 2026";
const FINAL_PITCH = "21. Juli 2026";

export default function PitchPage() {
  return (
    <div className="bg-paper">
      <PrintCSS />

      {/* ── 01 · COVER ─────────────────────────────────────── */}
      <Slide bg="bg-ink" className="text-paper">
        <div className="grid grid-cols-12 gap-x-6 w-full h-full">
          {/* Linke Spalte: Masthead */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/60">
              <span>Vol. I · No. 01</span>
              <span className="hidden md:inline">Konzept-Pitch · B05-05</span>
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
                <p>BIZ 26 · KI-Boutique DACH</p>
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
          <StatCell value="30" unit="Minuten" label="Voice-Interview mit Ada · deutscher Senior-Coach" />
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

      {/* ── 06 · LIVE-BEWEIS ─────────────────────────────────────── */}
      <Slide>
        <Eyebrow num="05" label="Beweis · Live-Run" />
        <H>"Hotel Alpenblick Garmisch" — <em className="text-burgundy" style={{ fontVariationSettings: '"WONK" 1' }}>gestern Abend</em>.</H>
        <p className="mt-6 text-lg text-ink2 max-w-2xl leading-relaxed">
          Pipeline läuft End-to-End gegen die echte Claude-Sonnet-4-6-API. Die Zahlen unten sind kein Mockup — sie kamen vor wenigen Stunden aus dem System.
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/15 border-y border-ink/15">
          <KPICell label="Investment Y1" value="71.960" unit="€" />
          <KPICell label="Savings Y1"    value="70.900" unit="€" accent />
          <KPICell label="Savings 3J"    value="248.100" unit="€" accent />
          <KPICell label="Payback"       value="12,2"   unit="Monate" />
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow-ink">Executive Summary · Live-LLM</p>
            <blockquote className="pull-quote mt-4">
              Ja, investieren — aber mit klarer Priorität. CRM-Re-Booking und Email-Triage zuerst, weil beide unter sechs Monaten amortisiert sind. Einen Use-Case sollten Sie zurückstellen: Schichtplan-Automation hat einen Payback von 28 Monaten.
            </blockquote>
          </div>
          <div>
            <p className="eyebrow-ink">Top-3 Quick Wins</p>
            <ol className="mt-6 space-y-6">
              <QuickWin num="01" name="Review-Autopilot" detail="Antwortzeit 8 Tage → <24 h. Antwortquote 59 % → 95 %." />
              <QuickWin num="02" name="Email-Triage" detail="60-70 % der Mails ohne manuellen Touch. ~15 h/Woche frei." />
              <QuickWin num="03" name="Mews ↔ OTA-Sync-Alarm" detail="Overbooking-Risiko eliminiert. Manuelle Kontrolle weg." />
            </ol>
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
              Vom Service-Beruf an der Bar über Standort-Leitung bis zur eigenen Digital-Strategie-Boutique BIZ 26. Ich kenne die Realität in Hotels — Personalmangel, OTA-Druck, schlechte Antwortzeiten, Reservierungs-Mail-Berg. Aus dieser Position heraus baue ich Tools, die genau diese Schmerzpunkte adressieren.
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
            title="BIZ-26-Distribution"
            detail="Bestehender Kanal-Mix: deinebusinesspage.de, meinvoiceagent.de, myflowmotion.cloud. DACH-Branchen-Netzwerk aus 20 Jahren."
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
          a.heyers@gmail.com · BIZ 26 · Vibe Coding Bootcamp · {TODAY}
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

function KPICell({ label, value, unit, accent = false }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="bg-paper p-8 flex flex-col">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">{label}</p>
      <p className={`mt-3 font-display text-4xl md:text-5xl leading-none ${accent ? "text-burgundy" : "text-ink"}`}
         style={{ fontVariationSettings: '"opsz" 144' }}>
        {value}
      </p>
      <p className="mt-2 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">{unit}</p>
    </div>
  );
}

function QuickWin({ num, name, detail }: { num: string; name: string; detail: string }) {
  return (
    <li className="flex gap-4">
      <span className="font-mono text-[10px] tracking-eyebrow text-burgundy pt-1.5">{num}</span>
      <div>
        <p className="font-display text-xl text-ink leading-tight">{name}</p>
        <p className="text-sm text-ink2 mt-1.5 leading-relaxed">{detail}</p>
      </div>
    </li>
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
