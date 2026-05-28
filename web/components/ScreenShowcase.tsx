import Image from "next/image";
import Link from "next/link";

/**
 * ScreenShowcase — „Was du wirklich sehen kannst."
 *
 * Bento-Grid mit echten Screencasts der Studio-Sub-Pages, plus ein
 * Terminal-Block mit echtem Code/Workflow-Snippet. Sichtbarer Beweis,
 * dass hier reale Software steht — nicht nur Pathos und Marketing-Prosa.
 *
 * Eingebaut nach der Pipeline-Section (07b · Uebertragbar).
 * Pure Server Component — alles statisch.
 */

type Shot = {
  href: string;
  src: string;
  eyebrow: string;
  title: string;
  blurb: string;
  status?: "live" | "im Bau";
  span?: "wide" | "tall" | "default";
};

const SHOTS: Shot[] = [
  {
    href: "/pitch",
    src: "/screencasts/pitch.jpg",
    eyebrow: "Pitch · Konzept-Doku",
    title: "Mein Projekt, in einem Dokument.",
    blurb:
      "Die Lange Version. Warum, fuer wen, mit welchem Plan — sauber durchgeschrieben, statt Pitch-Deck-Theater.",
    status: "live",
    span: "wide",
  },
  {
    href: "/agents",
    src: "/screencasts/agents.jpg",
    eyebrow: "Agents · 8 Spezialisten",
    title: "Ein Orchestrator. Acht Agenten.",
    blurb:
      "Die technische Lesart der Pipeline — mit SDK-Karten, Status-Pills und Daten-Schaubild.",
    status: "live",
    span: "tall",
  },
  {
    href: "/voice",
    src: "/screencasts/voice.jpg",
    eyebrow: "Voice · Interview mit Ada",
    title: "Gespraech mit Ada.",
    blurb:
      "Der Voice-Agent kennt schon die Analyse — und fragt freundlich nach. ElevenLabs Conversational AI ueber WebRTC.",
    status: "im Bau",
  },
  {
    href: "/customer-journey",
    src: "/screencasts/customer-journey.jpg",
    eyebrow: "Journey · 9 Phasen",
    title: "Vom LinkedIn-Klick bis zum Use-Case.",
    blurb:
      "Der ganze Weg eines Mittelstaendlers durch das Studio — Personas, Optionen und Test-Snippets je Phase.",
    status: "live",
  },
  {
    href: "/onboarding",
    src: "/screencasts/onboarding.jpg",
    eyebrow: "Onboarding · Step-by-Step",
    title: "Daten rein. Analyse beginnt.",
    blurb:
      "Eckdaten zum Haus, GuV und Reports hochladen — der Analyse-Agent legt los, bevor das Gespraech startet.",
    status: "im Bau",
  },
];

/** Mini-Workflow-Reihe — vorhandene PNG-Skizzen aus dem Repo */
const WORKFLOWS = [
  { src: "/wf1-reservation-triage.png", caption: "Reservation-Triage" },
  { src: "/wf2-document-analyst.png", caption: "Dokumenten-Analyst" },
  { src: "/wf3-voice-discovery.png", caption: "Voice-Discovery" },
  { src: "/wf4-multi-agent-report.png", caption: "Multi-Agent-Report" },
];

export function ScreenShowcase() {
  return (
    <section
      id="screencasts"
      className="brutal-bg-light border-b-2 border-ink scroll-reveal relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
        {/* ── Section-Head ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-8 mb-16">
          <div className="col-span-12 lg:col-span-2">
            <p className="eyebrow">· 07c · Was steht hier wirklich</p>
            <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/55">
              Stand {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long" })}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-10">
            <h2 className="h-brutal-md text-ink">
              Keine Mockups. <em className="italic-accent text-burgundy">Echte Seiten.</em>
            </h2>
            <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
              Das hier sind keine Figma-Frames und keine Hochglanz-Renderings — es sind die
              tatsaechlichen Bildschirme des Studios, wie sie auf myflowmotion.cloud laufen.
              Klick rein. Bei manchem siehst du, dass es schon traegt; bei anderem, dass es
              noch wackelt. Beides bewusst gezeigt.
            </p>
          </div>
        </div>

        {/* ── Bento-Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Hero · Pitch · wide (col-span-7) */}
          <ShotCard shot={SHOTS[0]} className="col-span-12 lg:col-span-7 aspect-[16/10]" />

          {/* Tall · Agents (col-span-5) */}
          <ShotCard shot={SHOTS[1]} className="col-span-12 lg:col-span-5 aspect-[4/5] lg:aspect-auto lg:row-span-2" />

          {/* Voice (col-span-4) */}
          <ShotCard shot={SHOTS[2]} className="col-span-12 md:col-span-6 lg:col-span-4 aspect-[4/3]" />

          {/* Journey (col-span-3) */}
          <ShotCard shot={SHOTS[3]} className="col-span-12 md:col-span-6 lg:col-span-3 aspect-[4/3]" />

          {/* Onboarding (col-span-12 — letzte Reihe nimmt Restbreite) */}
          <ShotCard shot={SHOTS[4]} className="col-span-12 lg:col-span-7 aspect-[16/9]" />
        </div>

        {/* ── Terminal-Block · echte Build-Realitaet ────────────── */}
        <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">· 07d · Im Terminal</p>
            <p className="mt-4 font-display text-2xl lg:text-3xl text-ink leading-snug">
              So sieht das von <em className="italic-accent text-burgundy">innen</em> aus.
            </p>
            <p className="mt-6 text-ink/70 leading-relaxed">
              Kein Code-Review-Spektakel — nur ein Auszug aus der laufenden Arbeit. Git-Log,
              ein Agent-Prompt, ein Pfad. Damit du siehst, dass hier wirklich getippt wird.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <pre
              className="bg-ink text-paper font-mono text-[12px] leading-[1.7] p-6 lg:p-8 overflow-x-auto border border-ink"
              aria-label="Auszug aus der Commit-Historie und Repo-Struktur"
            >
              <code>
                <span className="text-gold">$</span> git log --oneline -8{"\n"}
                <span className="text-paper/60">ed770e9</span> fix(homepage): Analyse-Agent in agentische Struktur ergaenzt{"\n"}
                <span className="text-paper/60">f211603</span> Build-Log-Reset: Homepage auf detailliertes, ehrliches Build-Log umgestellt{"\n"}
                <span className="text-paper/60">29b7388</span> Voice-Fix: tiefes 12-Domaenen-Interview im Agent-Prompt{"\n"}
                <span className="text-paper/60">83ffbb4</span> Fix: build.args (NEXT_PUBLIC_*) im web-Service{"\n"}
                <span className="text-paper/60">e78d065</span> Director&apos;s Cut live: neue Seiten + SDK-Struktur-Diagramm + Hoteldaten-Dataset{"\n"}
                <span className="text-paper/60">a8008ba</span> Safety vor SDK-Live-Wiring{"\n"}
                <span className="text-paper/60">74fb36e</span> Safety-Commit vor SDK-Build{"\n"}
                <span className="text-paper/60">42927b2</span> Authentic-Voice + BIZ-Cleanup{"\n"}
                {"\n"}
                <span className="text-gold">$</span> tree -L 1 -d ai-adoption-studio{"\n"}
                ai-adoption-studio{"\n"}
                <span className="text-paper/70">├── agents</span>          <span className="text-paper/40"># 8 Claude Agent SDK Subagenten</span>{"\n"}
                <span className="text-paper/70">├── agent_patterns</span>  <span className="text-paper/40"># wiederverwendbare Patterns</span>{"\n"}
                <span className="text-paper/70">├── api</span>             <span className="text-paper/40"># FastAPI-Endpoints</span>{"\n"}
                <span className="text-paper/70">├── knowledge</span>       <span className="text-paper/40"># Branchen-Wissen, DSGVO-Snippets</span>{"\n"}
                <span className="text-paper/70">├── Hoteldaten</span>      <span className="text-paper/40"># Test-Datasets, anonymisiert</span>{"\n"}
                <span className="text-paper/70">├── docs</span>             <span className="text-paper/40"># SDK-Architektur, Specs</span>{"\n"}
                <span className="text-paper/70">└── web</span>              <span className="text-paper/40"># Next.js Frontend (das hier)</span>{"\n"}
              </code>
            </pre>
            <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/45">
              Auszug · keine Inszenierung · ein echter Stand vom heutigen Tag
            </p>
          </div>
        </div>

        {/* ── Workflow-Sketches ─────────────────────────────────── */}
        <div className="mt-20 pt-10 border-t border-ink/15">
          <div className="grid grid-cols-12 gap-x-8 mb-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">· 07e · Workflow-Sketches</p>
              <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/55">
                vier Abschnitte aus dem Architektur-Schema
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <p className="text-lg text-ink/70 leading-relaxed max-w-2xl">
                Bevor ein Agent gebaut wird, steht eine Skizze. Hier vier davon: vom
                Reservation-Triage bis zum Multi-Agent-Report. Schaubilder zum Verstehen,
                nicht zum Bestaunen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {WORKFLOWS.map((w) => (
              <figure
                key={w.src}
                className="bg-paper2 border border-ink/15 p-3 lg:p-4 tilt-card group"
              >
                <div className="tilt-card-inner relative aspect-[4/3] overflow-hidden bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.src}
                    alt={`Architektur-Skizze · ${w.caption}`}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/65">
                  {w.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
function ShotCard({ shot, className }: { shot: Shot; className?: string }) {
  const status =
    shot.status === "live"
      ? { dot: "bg-burgundy", label: "live" }
      : shot.status === "im Bau"
      ? { dot: "bg-gold", label: "im Bau" }
      : null;

  return (
    <Link
      href={shot.href}
      className={`group relative block bg-ink overflow-hidden tilt-card ${className ?? ""}`}
    >
      <div className="tilt-card-inner absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={`Screencast · ${shot.title}`}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity duration-500"
        />
        {/* Editorial Overlay-Gradient nach unten */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-transparent"
        />
        {/* Hover-Burgundy-Wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/15 transition-colors duration-500"
        />

        {/* Top-Bar — Status + Eyebrow */}
        <div className="relative z-10 flex items-start justify-between p-5 lg:p-6">
          <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/85">
            {shot.eyebrow}
          </p>
          {status && (
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-eyebrow uppercase text-paper">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
              {status.label}
            </span>
          )}
        </div>

        {/* Bottom-Text */}
        <div className="absolute left-0 right-0 bottom-0 p-5 lg:p-7">
          <h3 className="font-display text-2xl lg:text-3xl text-paper leading-tight">
            <em>{shot.title}</em>
          </h3>
          <p className="mt-3 text-paper/75 text-sm leading-relaxed max-w-md">{shot.blurb}</p>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-eyebrow uppercase text-gold">
            <span className="hover-slide">Seite oeffnen</span>
            <span aria-hidden="true">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
