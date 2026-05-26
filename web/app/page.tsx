import Link from "next/link";
import Image from "next/image";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import { StatusPill } from "@/components/StatusPill";
import { getCurrentDay, BOOTCAMP_DAYS } from "@/lib/bootcamp";

/**
 * Landing-Page · Director's Cut (Voice-Reset 26.05.2026).
 * Persönliche Projekt-Doku: zeigt WIE Alex arbeitet, nicht das Tool.
 * Kernbotschaft: aus Gespräch wird strukturierte Datenbasis — kein Mitarbeiter-Ersatz,
 * keine KI-Verherrlichung. Agenten als Library auf dem Claude Agent SDK (im Aufbau).
 * Engine ehrlich: echter Code im Backend, live. Keine erfundenen Zahlen.
 */

type BuildEntry = {
  day: string;
  date: string;
  title: string;
  body: string;
  status: "live" | "building" | "planned";
};

const RECENT_BUILDS: BuildEntry[] = [
  {
    day: "Tag 19",
    date: "24.05.2026",
    title: "Der Voice-Agent bekommt Gedächtnis.",
    body:
      "Den Voice-Teil so verdrahtet, dass das Gespräch nicht bei null anfängt: Der Agent soll erst die hochgeladenen Dokumente kennen, bevor er das erste Wort sagt. Klingt simpel, war's nicht — die Übergabe der Analyse ins Gespräch hat mich zwei Anläufe gekostet. Grundgerüst steht. Der freundliche Ton fehlt noch, das ist morgen dran.",
    status: "building",
  },
  {
    day: "Tag 13",
    date: "18.05.2026",
    title: "Dokumente werden gelesen.",
    body:
      "Der erste Agent liest jetzt hochgeladene Dateien — PDF, Excel, CSV — und macht aus dem Wust eine strukturierte Übersicht: Belegung, Durchschnittspreis, OTA-Anteil, wo das Geld herkommt und wohin es geht. Genau der Schritt, den ich früher mit Bauchgefühl gemacht habe. Persönliches wird vorher anonymisiert.",
    status: "live",
  },
  {
    day: "Tag 3",
    date: "08.05.2026",
    title: "Architektur entschieden.",
    body:
      "Fundament gelegt: Next.js für das, was du siehst, ein Python-Backend für die Agenten dahinter, eine Datenbank für alles, was bleiben soll. Bewusst nah am echten Produkt — nicht zusammengeklickt, sondern so, dass es wirklich deployt und läuft.",
    status: "live",
  },
  {
    day: "Tag 1",
    date: "06.05.2026",
    title: "Tag eins.",
    body:
      "Kurz nach 18 Uhr, 23 Leute auf dem Bildschirm. Erste Vorstellungsrunde — und sofort ein richtig gutes Gefühl: neugierige Menschen, ganz unterschiedliche Wege hierher, Trainer von Zalando, XING, SumUp, OTTO. Klar, manche konnten schon coden und ich kaum — aber damit war ich nicht allein, und es fühlte sich von der ersten Minute mehr nach Aufbruch an als nach Prüfung. Ich wusste sofort: Hier will ich was bauen.",
    status: "live",
  },
];

const AGENTS: { n: string; name: string; role: string; status: "live" | "building" | "planned" }[] = [
  { n: "01", name: "Web-Research", role: "Vorab-Recherche zum Haus", status: "live" },
  { n: "02", name: "Dokumenten-Analyst", role: "liest GuV / Reports / Listen", status: "live" },
  { n: "03", name: "Prozess-Auditor", role: "wo Zeit verloren geht", status: "live" },
  { n: "04", name: "Use-Case-Generator", role: "konkrete Ansatzpunkte", status: "building" },
  { n: "05", name: "Tool-Empfehlung", role: "passende Werkzeuge + DSGVO", status: "building" },
  { n: "06", name: "Wirtschaftlichkeit", role: "Aufwand, Nutzen, Amortisation", status: "planned" },
  { n: "07", name: "Compliance-Check", role: "DSGVO · AI-Act · Branche", status: "planned" },
  { n: "08", name: "Reporter", role: "bündelt alles lesbar", status: "building" },
];

export default function HomePage() {
  const day = getCurrentDay();

  return (
    <>
      <EditorialHeader />
      <main>
        {/* ═══ 01 · HERO ═══ */}
        <section className="brutal-bg-dark relative overflow-hidden min-h-[820px] lg:min-h-[900px] flex flex-col">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at 78% 28%, rgba(122,132,113,0.12), transparent 60%), radial-gradient(ellipse at 18% 82%, rgba(107,39,55,0.10), transparent 55%)",
            }}
          />
          <div className="flex-1 mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-28 lg:pt-32 pb-20 flex flex-col">
            <div className="flex items-center gap-3 mb-10 hero-fade-in flex-wrap">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sage opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
              </span>
              <span className="font-mono text-[11px] tracking-eyebrow uppercase text-paper/80">
                Live im Bau · Tag {day} von {BOOTCAMP_DAYS} · Vibe Coding Bootcamp 2026
              </span>
            </div>

            <h1 style={{ color: "#FAF6EE" }}>
              <span
                className="block font-sans font-medium mb-6 hero-fade-in text-paper/70"
                style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.7rem)", letterSpacing: "-0.005em" }}
              >
                Zwanzig Jahre Hotel und Gastro. Jetzt baue ich das Werkzeug selbst.
              </span>
              <span
                className="block hero-fade-in"
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3.4rem, 12vw, 13rem)",
                  lineHeight: 0.84,
                  letterSpacing: "-0.055em",
                  color: "#FAF6EE",
                }}
              >
                Schau mir beim
              </span>
              <span
                className="block hero-fade-in mt-2 lg:mt-3"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontWeight: 500,
                  fontStyle: "italic",
                  fontSize: "clamp(3.4rem, 12vw, 13rem)",
                  lineHeight: 0.84,
                  letterSpacing: "-0.045em",
                  color: "#B8945F",
                }}
              >
                Bauen zu.
              </span>

              <span
                className="mt-12 lg:mt-16 block max-w-3xl text-paper/85 hero-fade-in"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.45rem)", lineHeight: 1.55 }}
              >
                Das hier ist mein Projekt-Studio — offen dokumentiert, Tag für Tag. Ich baue ein Werkzeug
                für die Häuser, in denen ich selbst gestanden habe. Es ersetzt niemanden. Es hört zu — und
                macht aus einem Gespräch nebenbei eine{" "}
                <em className="italic-accent text-paper">saubere Datenbasis</em>, mit der man am
                Montagmorgen sofort arbeiten kann. Kein Hochglanz, keine KI-Show. Während du das liest,
                baue ich. Du siehst jeden Schritt — auch die, die schiefgehen.
              </span>
            </h1>

            <div className="mt-auto pt-16 grid grid-cols-12 gap-x-8 gap-y-6 border-t border-paper/15 hero-fade-in">
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">Engine</p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                  <em>Echte Agenten im Code</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">live auf dem Server — kein Mockup</span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">Worum es geht</p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                  <em>Reden → Struktur</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">aus Gespräch wird verwertbare Datenbasis</span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex flex-col md:items-end md:text-right">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">Wer baut</p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                  <em>Alex Heyers</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">20 Jahre Hospitality · Mosbach</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-paper/15">
            <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-5 flex items-center justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
              <span>Vibe Coding Bootcamp · 06.05.–30.07.2026</span>
              <span className="hidden md:inline">Tag {day} von {BOOTCAMP_DAYS}</span>
              <span>↓ Build-Log</span>
            </div>
          </div>
        </section>

        {/* ═══ 02 · BUILD-LOG ═══ */}
        <section id="build-log" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 lg:py-32">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 01 · Build-Log</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Was diese Woche <em className="italic-accent text-burgundy">entstanden</em> ist.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Kein Marketing, kein Roadmap-Theater. Was ich an einem Tag gebaut habe, steht hier am
                  nächsten Morgen — mit Datum und einem ehrlichen &bdquo;das hat länger gedauert als
                  gedacht&ldquo;, wenn&apos;s so war. Läuft etwas, steht&apos;s da. Häng ich fest, auch.
                </p>
              </div>
            </div>

            <div className="space-y-px bg-ink/15 border-y border-ink/15">
              {RECENT_BUILDS.map((b) => (
                <article key={b.day} className="bg-paper p-8 lg:p-10 grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                      {b.day} · {b.date.slice(0, 5)}
                    </p>
                    <div className="mt-3">
                      <StatusPill status={b.status} />
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl lg:text-3xl text-ink">
                      <em>{b.title}</em>
                    </h3>
                    <p className="mt-3 text-ink/70 leading-relaxed max-w-2xl">{b.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
              Stand 24.05.2026 · letzte Einträge sichtbar
            </p>
          </div>
        </section>

        {/* ═══ 03 · MEGA-MARQUEE ═══ */}
        <div className="marquee-mega">
          <div className="marquee-mega-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-16 shrink-0 pl-16">
                <span className="marquee-mega-item">
                  Tag {day} von {BOOTCAMP_DAYS} <em>· live im Bau ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Reden <em>· wird Struktur ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Mosbach <em>· DACH · Hospitality ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 04 · WARUM ═══ */}
        <section className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="eyebrow">· 02 · Warum ich das mache</p>
              <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">Alex Heyers · Mosbach</p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal-md text-ink">
                Ich <em className="italic-accent text-burgundy">liebe</em> diese Branche.
                <br />
                Und ich kenne ihren Papierkram.
              </h2>
              <div className="mt-16 grid md:grid-cols-2 gap-12 lg:gap-20 text-lg lg:text-xl text-ink/80 leading-relaxed">
                <p className="drop-cap-grand">
                  Service, Bar, Standort, Direktion — zwanzig Jahre dieselbe Welt. In der Zeit kam ein
                  Berater nach dem anderen ins Haus, mit dicken Foliensätzen und großen Worten. Was am
                  Samstag um neun wirklich passiert, stand nie drin. Diese Lücke hat mich jahrelang
                  gewurmt — nicht aus Wut auf die Berater, sondern weil ich wusste: Das müsste auch anders gehen.
                </p>
                <p>
                  Also lerne ich, es selbst zu bauen. Ein Werkzeug, das zuhört und mitschreibt, statt zu
                  versprechen. Ich glaube nicht an &bdquo;die KI macht euren Job&ldquo; — ich glaube, dass
                  die richtigen Fragen, sauber erfasst, eine Menge Routine abnehmen. Damit wieder Zeit für
                  das bleibt, weswegen man in diese Branche geht: Gäste, Menschen. Heute ist Tag {day} von{" "}
                  {BOOTCAMP_DAYS}. Ob ich&apos;s hinbekomme, siehst du hier mit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 05 · WIE ICH ARBEITE ═══ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">· 03 · Wie ich arbeite</p>
            <h2 className="h-brutal text-paper" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
              Klein anfangen.
              <br />
              <em className="italic-accent text-gold">Ehrlich</em> bleiben.
            </h2>
            <div className="mt-16 grid md:grid-cols-3 gap-12 lg:gap-16 text-paper/80 text-lg leading-relaxed">
              <div>
                <p className="font-display text-burgundy text-3xl italic">i.</p>
                <p className="mt-4 h-brutal-sm text-paper">In Bausteinen denken</p>
                <p className="mt-4 text-paper/70">
                  Kein Mega-Ding, das alles auf einmal soll. Ich zerlege jedes Problem in kleine Teile,
                  die ich einzeln prüfen kann. Wie eine gute Brigade in der Küche — jeder Posten ein klarer Job.
                </p>
              </div>
              <div>
                <p className="font-display text-burgundy text-3xl italic">ii.</p>
                <p className="mt-4 h-brutal-sm text-paper">Die KI baut, ich entscheide</p>
                <p className="mt-4 text-paper/70">
                  Den Code schreibe ich mit KI. Aber was richtig und was Quatsch ist, entscheide ich — mit
                  zwanzig Jahren Wissen, wie ein Haus wirklich tickt. Das ist der Teil, den keine KI hat.
                </p>
              </div>
              <div>
                <p className="font-display text-burgundy text-3xl italic">iii.</p>
                <p className="mt-4 h-brutal-sm text-paper">Sagen, was (noch) nicht geht</p>
                <p className="mt-4 text-paper/70">
                  Ich schreibe nicht &bdquo;fertig&ldquo;, wenn&apos;s halb steht. Was läuft, läuft. Was im
                  Bau ist, heißt &bdquo;im Bau&ldquo;. Das ist kein Makel — das ist der ganze Punkt von
                  &bdquo;live dokumentiert&ldquo;.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 06 · SO LÄUFT'S ═══ */}
        <section id="ablauf" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 04 · So läuft&apos;s</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Aus einem Gespräch wird eine <em className="italic-accent text-burgundy">Datenbasis</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Der eigentliche Trick: Während man einfach über sein Haus redet, entsteht im Hintergrund
                  eine strukturierte Erfassung. Kein Formular-Ausfüllen, kein Workshop-Marathon. Reden — und
                  am Ende liegt etwas vor, mit dem man arbeiten kann.
                </p>
              </div>
            </div>

            <ol className="grid md:grid-cols-5 gap-px bg-ink/15 border-y border-ink/15">
              {[
                { n: "01", t: "Daten hochladen", b: "Bei der Anmeldung: Eckdaten des Hauses (Größe, Name, Region) und vorhandene Dokumente — GuV, Geschäftsberichte, Prozess-Beschreibungen.", s: "live" as const },
                { n: "02", t: "Erster Agent liest", b: "Der Analyse-Agent macht aus den Dokumenten eine strukturierte Übersicht — die Grundlage fürs Gespräch.", s: "live" as const },
                { n: "03", t: "Freundliches Gespräch", b: "Der Voice-Agent kennt die Analyse schon — und fragt freundlich nach: erst zu den Zahlen, dann konkret zu Infrastruktur, Tools und wo's wirklich drückt.", s: "building" as const },
                { n: "04", t: "Struktur entsteht", b: "Aus dem Gespräch wird automatisch eine saubere, weiterverwendbare Datenbasis — Prozesse, Engpässe, Tool-Landschaft.", s: "building" as const },
                { n: "05", t: "Realistische Empfehlungen", b: "Vorschläge, die ein normales Haus auch umsetzen kann. Kein Hollywood — Dinge, die funktionieren, mit ehrlichem Aufwand und Nutzen.", s: "planned" as const },
              ].map((step) => (
                <li key={step.n} className="bg-paper p-7">
                  <p className="brutal-rank text-burgundy">{step.n}</p>
                  <p className="mt-3 font-display text-xl text-ink">
                    <em>{step.t}</em>
                  </p>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed">{step.b}</p>
                  <div className="mt-4">
                    <StatusPill status={step.s} />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-ink/60 text-base max-w-3xl leading-relaxed">
              Und ja — die KI wird hier nicht zum Helden hochstilisiert. Der Wert liegt nicht im
              &bdquo;wow, eine KI&ldquo;, sondern darin, dass am Ende verwertbare Struktur dasteht statt
              eines Bauchgefühls. Genau das macht diese Prozesse sinnvoll.
            </p>
          </div>
        </section>

        {/* ═══ 07 · VOICE-AGENT ═══ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">· 05 · Der Voice-Agent</p>
            <h2 className="h-brutal text-paper" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
              Er hört zu —
              <br />
              und <em className="italic-accent text-gold">gibt weiter</em>.
            </h2>
            <p className="mt-10 max-w-2xl text-paper/75 text-lg leading-relaxed">
              So arbeitet der Voice-Agent: Er sammelt nicht stur ab, sondern führt ein Gespräch — und reicht
              das Verstandene strukturiert an die nächsten Schritte weiter. Hier siehst du, wie die
              Information fließt.
            </p>
            <div className="mt-14 grid md:grid-cols-4 gap-px bg-paper/15 border-y border-paper/15">
              {[
                { k: "Input", t: "Analyse-Ergebnis", b: "Der Agent ist vorab mit der Dokumenten-Analyse versorgt — er weiß schon, worüber er redet." },
                { k: "Gespräch", t: "Freundlich nachfragen", b: "Erst über die vorhandenen Daten reden, dann tiefer: Infrastruktur, Tools, akuter Handlungsbedarf — warmer Ton." },
                { k: "Erfassen", t: "Struktur bilden", b: "Was im Gespräch gesagt wird, wird strukturiert festgehalten — Prozesse, Engpässe, Automatisierbares." },
                { k: "Weitergeben", t: "An die Pipeline", b: "Die strukturierten Daten gehen an die nächsten Agenten — und werden zu konkreten Empfehlungen." },
              ].map((c) => (
                <div key={c.k} className="bg-[#0A0A0A] p-7">
                  <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold">{c.k}</p>
                  <p className="mt-4 font-display text-2xl text-paper">
                    <em>{c.t}</em>
                  </p>
                  <p className="mt-3 text-sm text-paper/65 leading-relaxed">{c.b}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
              Hinweis · den Live-Voice-Agent zum Selbst-Ausprobieren schalte ich frei, sobald er rund läuft
            </p>
          </div>
        </section>

        {/* ═══ 08 · PIPELINE ═══ */}
        <section id="pipeline" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-12">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 06 · Die Pipeline</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
                  Viele <em className="italic-accent text-burgundy">Spezialisten</em>.
                  <br />
                  Ein Ablauf.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Statt einem Alleskönner: mehrere spezialisierte Agenten, jeder mit klarem Job und
                  prüfbarem Ergebnis. Das Studio ist als{" "}
                  <em className="italic-accent text-burgundy">Agenten-Library auf dem Claude Agent SDK</em>{" "}
                  aufgebaut <span className="text-ink/50">(im Aufbau)</span> — jeder Agent ein eigenständiger
                  Baustein mit eigenen Tools, kein Klick-Workflow. Dasselbe Muster lässt sich auf andere
                  Branchen übertragen.
                </p>
                <p className="mt-4 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                  Wie die Agenten zusammenspielen →{" "}
                  <Link href="/agents" className="text-burgundy hover-slide">
                    Agents-Seite
                  </Link>
                </p>
              </div>
            </div>

            <div className="mb-12 p-7 lg:p-8 bg-paper2 border border-ink/15">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy mb-3">Kurz erklärt · Was ist ein Agent-SDK?</p>
              <p className="text-base lg:text-lg text-ink/80 leading-relaxed max-w-3xl">
                Ein <em className="italic-accent text-burgundy">SDK</em> ist ein fertiger Werkzeugkasten für
                Entwickler. Das <em className="italic-accent text-burgundy">Claude Agent SDK</em> ist der Bausatz
                von Anthropic, um KI-Agenten zu bauen — kleine Programme, die eine klar umrissene Aufgabe
                selbstständig erledigen, dabei Werkzeuge nutzen und ein geprüftes Ergebnis liefern. Statt alles
                von Hand zu verdrahten, setze ich jeden meiner Agenten auf diesen Standard-Bausatz. Vorteil:
                sauberer, wiederverwendbar — und dieselbe Technik, auf der Claude Code selbst läuft.
              </p>
            </div>

            <ul className="grid md:grid-cols-2 gap-x-12 gap-y-3 border-t border-ink/15 pt-10">
              {AGENTS.map((a) => (
                <li key={a.n} className="flex items-center gap-4 py-2 border-b border-ink/10">
                  <span className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy w-8 shrink-0">{a.n}</span>
                  <span className="font-display text-lg text-ink flex-1">
                    <em>{a.name}</em>
                    <span className="text-ink/50 font-sans text-sm not-italic ml-3">— {a.role}</span>
                  </span>
                  <StatusPill status={a.status} />
                </li>
              ))}
            </ul>

            <div className="mt-12 p-8 bg-paper2 border-l-2 border-burgundy max-w-3xl">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy mb-3">Übertragbar</p>
              <p className="text-lg text-ink/80 leading-relaxed">
                Ich baue das für Hotels, weil ich diese Welt zwanzig Jahre gelebt habe — da bin ich
                glaubwürdig. Aber die Mechanik dahinter ist{" "}
                <em className="italic-accent text-burgundy">branchen-blind</em>: andere Daten rein, anderes
                Wissen eingepflegt — und dieselbe Pipeline arbeitet für eine ganz andere Branche.
                Hospitality ist mein Beispiel, nicht meine Grenze.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ 09 · KONTEXT ═══ */}
        <section className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 07 · Kontext</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
                  Für wen ich das <em className="italic-accent text-burgundy">baue</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 max-w-2xl leading-relaxed">
                  Ehrlich gesagt ist diese Seite auch eine Bewerbung. Ab August 2026 — DACH, remote,
                  Vollzeit oder Senior-Freelance. Wenn dir gefällt, wie ich hier arbeite, dann sollten wir reden.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-ink">
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">Wen ich suche</p>
                <ul className="space-y-5 text-xl lg:text-2xl text-ink leading-snug">
                  {["Hospitality-Tech-Anbieter", "Digital-Agenturen mit Hospitality-Fokus", "Hotel-Gruppen mit Digital-Bedarf", "Beratungen für Digitalisierung im Gastgewerbe"].map((t) => (
                    <li key={t} className="flex gap-4">
                      <span className="text-burgundy">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">Was diese Seite belegt</p>
                <ul className="space-y-5 text-xl lg:text-2xl text-ink leading-snug">
                  {["Beratungs-Methode in Code übersetzt", "Full-Stack: Next.js · Python · Multi-Agent", "20 Jahre echte Branchen-Erfahrung", "Dranbleiben: live dokumentiert, Tag für Tag"].map((t) => (
                    <li key={t} className="flex gap-4">
                      <span className="text-burgundy">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 10 · AUTOR ═══ */}
        <section id="author" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36 grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-2">
              <p className="eyebrow">· 08 · Autor</p>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="relative aspect-square overflow-hidden bg-ink">
                <Image src="/alex-heyers-portrait.jpg" alt="Alex Heyers" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-eyebrow uppercase text-ink/50">Fig. 1 · Mosbach · MMXXVI</p>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
                Alex
                <br />
                <em className="italic-accent text-burgundy">Heyers</em>.
              </h2>
              <p className="mt-6 font-mono text-[11px] tracking-eyebrow uppercase text-ink/60">
                Mosbach · 20 Jahre Hospitality · Vibe Coder im Bootcamp 2026
              </p>
              <div className="mt-10 space-y-6 text-lg text-ink/80 leading-[1.7]">
                <p>
                  Zwanzig Jahre Branchenweg: Service, Bar, Standort, Direktion — mit allen Schrammen, die
                  dazugehören. 2025 Vater geworden, und damit ein neuer Maßstab dafür, was Zeit wert ist.
                  2026 zurück auf die Schulbank: drei Monate Vibe Coding Bootcamp, weil ich wissen wollte,
                  ob ich das, was Berater immer nur versprechen, selbst bauen kann.
                </p>
                <p>
                  Spoiler: Ich kann&apos;s. Noch nicht perfekt, aber jeden Tag mehr. Diese App ist meine
                  Antwort auf zwanzig Jahre Frust mit Foliensätzen — für die Häuser, in denen ich
                  gearbeitet habe, und für die Tech-Anbieter, die genau diese Häuser verstehen wollen.
                </p>
                <p>
                  Der Wechsel von der Hospitality-Praxis zur Hospitality-Technik war keine Kehrtwende. Eher
                  eine Übersetzung. Diese Seite ist die laufende Beweisaufnahme.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 11 · CTA ═══ */}
        <section className="brutal-bg-dark relative overflow-hidden spotlight">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-36 lg:py-48 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">· 09 · Reden wir</p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal text-paper">
                <em className="italic-accent text-gold">Bis hierher gescrollt?</em>
              </h2>
              <p className="mt-10 text-lg lg:text-xl text-paper/80 leading-relaxed max-w-2xl">
                Dann zieht dich am Projekt etwas an. Vielleicht die Branche, vielleicht der Ansatz,
                vielleicht die Vorstellung, dass jemand zwanzig Jahre gewartet hat, um endlich selbst zu
                bauen, was er sich immer gewünscht hätte. Egal ob du Recruiter bist, Hotelier oder Kollege
                auf dem Weg — schreib mir.
              </p>
              <div className="mt-16 flex flex-col gap-6">
                <a
                  href="mailto:a.heyers@gmail.com"
                  className="hover-slide font-display italic text-paper hover:text-gold transition-colors"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1 }}
                >
                  a.heyers@gmail.com
                </a>
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-paper/60">
                  LinkedIn · /in/alex-heyers · Antwort meist unter 24 Stunden
                </p>
              </div>
              <p className="mt-24 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50 max-w-2xl leading-relaxed">
                Im Gespräch für · Solutions Engineer · Implementation Consultant · Customer Success bei
                Hospitality-Tech · DACH-Remote · ab 01.08.2026
              </p>
            </div>
          </div>
        </section>
      </main>
      <EditorialFooter />
    </>
  );
}
