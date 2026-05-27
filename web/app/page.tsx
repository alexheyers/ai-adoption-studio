import Link from "next/link";
import Image from "next/image";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import { StatusPill } from "@/components/StatusPill";
import { getCurrentDay, BOOTCAMP_DAYS } from "@/lib/bootcamp";
import { BUILD_LOG } from "@/lib/build-log";

/**
 * Landing-Page · Build-Log-Reset (27.05.2026).
 * Herzstück = ein detailliertes, ehrliches Build-Log mit den echten täglichen Schritten.
 * Das Log wird automatisch generiert (scripts/gen-build-log.mjs) aus Git-Historie +
 * Kuratier-Schicht (content/build-log.curated.json) + optional freigegebenen Notion-Zeilen.
 * Weniger Pathos, keine Effekthascherei, keine Produkt-/Akquise-Sprache — persönliche
 * Projekt-Doku und zugleich Bewerbung. Keine erfundenen Zahlen.
 */

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
        {/* ═══ 01 · HERO · ruhig, knapp ═══ */}
        <section className="brutal-bg-dark relative overflow-hidden">
          <div className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-24 lg:pt-28 pb-16 lg:pb-20">
            <div className="flex items-center gap-3 mb-10 hero-fade-in flex-wrap">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sage opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
              </span>
              <span className="font-mono text-[11px] tracking-eyebrow uppercase text-paper/80">
                Live im Bau · Tag {day} von {BOOTCAMP_DAYS} · Vibe Coding Bootcamp 2026
              </span>
            </div>

            <h1 className="h-brutal-md text-paper max-w-4xl hero-fade-in">
              Ich baue ein Werkzeug für die Häuser, in denen ich selbst{" "}
              <em className="italic-accent text-gold">gestanden</em> habe.
              <br />
              Und schreibe jeden Schritt mit.
            </h1>

            <p
              className="mt-10 block max-w-2xl text-paper/85 hero-fade-in"
              style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.6 }}
            >
              Das hier ist mein offenes Projekt-Tagebuch — Tag für Tag, mit Datum. Das Werkzeug
              ersetzt niemanden; es hört zu und macht aus einem Gespräch nebenbei eine{" "}
              <em className="italic-accent text-paper">saubere Datenbasis</em>, mit der man am
              Montagmorgen sofort arbeiten kann. Kein Hochglanz, keine KI-Show. Du siehst hier jeden
              Schritt — auch die, die schiefgehen.
            </p>

            <div className="mt-14 pt-10 grid grid-cols-12 gap-x-8 gap-y-6 border-t border-paper/15 hero-fade-in">
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">Engine</p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                  <em>Echter Code, live</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">FastAPI-Backend + 10 Agenten auf dem Server — kein Mockup</span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">Worum es geht</p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                  <em>Reden → Struktur</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">aus dem Gespräch wird verwertbare Datenbasis</span>
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
              <a href="#build-log" className="hover-slide text-gold">↓ Zum Build-Log</a>
            </div>
          </div>
        </section>

        {/* ═══ 02 · BUILD-LOG · das Herzstück ═══ */}
        <section id="build-log" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 lg:py-32">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 01 · Build-Log</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Was hier wirklich <em className="italic-accent text-burgundy">entstanden</em> ist.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Kein Marketing, kein Roadmap-Theater. Jeder Eintrag hier steht auf einem echten
                  Arbeitstag — mit Datum, mit dem, was lief, und ehrlich auch mit dem, was länger
                  gedauert hat als gedacht. Läuft etwas, steht es da. Häng ich fest, auch.
                </p>
              </div>
            </div>

            <div className="space-y-px bg-ink/15 border-y border-ink/15">
              {BUILD_LOG.map((b, i) => (
                <article key={`${b.iso}-${i}`} className="bg-paper p-8 lg:p-10 grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                      {b.day} · {b.date.slice(0, 5)}
                    </p>
                    <div className="mt-3">
                      <StatusPill status={b.status} />
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl lg:text-3xl text-ink leading-snug">
                      <em>{b.title}</em>
                    </h3>
                    <p className="mt-4 text-ink/75 leading-relaxed max-w-2xl">{b.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
              Automatisch aus Commit-Historie + Projekt-Kanban · letzter Eintrag {BUILD_LOG[0]?.date}
            </p>
          </div>
        </section>

        {/* ═══ 03 · WARUM ═══ */}
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
                  gewurmt — nicht aus Wut auf die Berater, sondern weil ich wusste: das müsste auch anders gehen.
                </p>
                <p>
                  Also lerne ich, es selbst zu bauen. Ein Werkzeug, das zuhört und mitschreibt, statt zu
                  versprechen. Ich glaube nicht an &bdquo;die KI macht euren Job&ldquo; — ich glaube, dass
                  die richtigen Fragen, sauber erfasst, eine Menge Routine abnehmen. Damit wieder Zeit für
                  das bleibt, weswegen man in diese Branche geht: Gäste, Menschen. Heute ist Tag {day} von{" "}
                  {BOOTCAMP_DAYS}. Ob ich das hinbekomme, siehst du hier mit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 04 · WIE ICH ARBEITE ═══ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">· 03 · Wie ich arbeite</p>
            <h2 className="h-brutal-md text-paper">
              Klein anfangen. <em className="italic-accent text-gold">Ehrlich</em> bleiben.
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
                  Ich schreibe nicht &bdquo;fertig&ldquo;, wenn es halb steht. Was läuft, läuft. Was im
                  Bau ist, heißt &bdquo;im Bau&ldquo;. Das ist kein Makel — das ist der ganze Punkt an
                  &bdquo;live dokumentiert&ldquo;.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 05 · SO LÄUFT'S ═══ */}
        <section id="ablauf" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 04 · So läuft es</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Aus einem Gespräch wird eine <em className="italic-accent text-burgundy">Datenbasis</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Während man einfach über sein Haus redet, entsteht im Hintergrund eine strukturierte
                  Erfassung. Kein Formular-Ausfüllen, kein Workshop-Marathon. Reden — und am Ende liegt
                  etwas vor, mit dem man arbeiten kann.
                </p>
              </div>
            </div>

            <ol className="grid md:grid-cols-5 gap-px bg-ink/15 border-y border-ink/15">
              {[
                { n: "01", t: "Daten hochladen", b: "Bei der Anmeldung: Eckdaten des Hauses (Größe, Name, Region) und vorhandene Dokumente — GuV, Geschäftsberichte, Prozess-Beschreibungen.", s: "live" as const },
                { n: "02", t: "Erster Agent liest", b: "Der Analyse-Agent macht aus den Dokumenten eine strukturierte Übersicht — die Grundlage fürs Gespräch.", s: "live" as const },
                { n: "03", t: "Freundliches Gespräch", b: "Der Voice-Agent kennt die Analyse schon — und fragt freundlich nach: erst zu den Zahlen, dann konkret zu Infrastruktur, Tools und wo es wirklich drückt.", s: "building" as const },
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
              Die KI wird hier nicht zum Helden hochstilisiert. Der Wert liegt nicht im
              &bdquo;wow, eine KI&ldquo;, sondern darin, dass am Ende verwertbare Struktur dasteht statt
              eines Bauchgefühls.
            </p>
          </div>
        </section>

        {/* ═══ 06 · VOICE-AGENT ═══ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">· 05 · Der Voice-Agent</p>
            <h2 className="h-brutal-md text-paper">
              Er hört zu — und <em className="italic-accent text-gold">gibt weiter</em>.
            </h2>
            <p className="mt-10 max-w-2xl text-paper/75 text-lg leading-relaxed">
              Der Voice-Agent sammelt nicht stur ab, sondern führt ein Gespräch — und reicht das
              Verstandene strukturiert an die nächsten Schritte weiter. So fließt die Information:
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

        {/* ═══ 07 · PIPELINE ═══ */}
        <section id="pipeline" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-12">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 06 · Die Pipeline</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Viele <em className="italic-accent text-burgundy">Spezialisten</em>. Ein Ablauf.
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

            <figure className="mb-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/agentic-structure.svg"
                alt="Agentische Struktur: Der Analyse-Agent wertet die hochgeladenen Hoteldaten aus und übergibt seine Hypothesen an das Voice-Interview mit Ada; Analyse-Ergebnis und Gespräch fließen in ein Kontext-Objekt; der Orchestrator auf dem Claude Agent SDK steuert acht Agenten; der Reporter verdichtet alles zu Report, Excel und PDF."
                className="w-full max-w-[1100px] mx-auto"
              />
              <figcaption className="mt-4 text-center font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                Vom Upload bis zur Empfehlung — orchestrierte SDK-Agenten, ein Ablauf
              </figcaption>
            </figure>

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

        {/* ═══ 08 · KONTEXT · Bewerbung (keine Akquise) ═══ */}
        <section className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="eyebrow">· 07 · Warum ich das zeige</p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Diese Seite ist auch eine <em className="italic-accent text-burgundy">Bewerbung</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 max-w-2xl leading-relaxed">
                  Ab August 2026 suche ich eine neue Aufgabe — DACH, remote, Vollzeit oder Senior-Freelance.
                  Statt einer Mappe mit Behauptungen zeige ich lieber, wie ich tatsächlich arbeite. Wenn dir
                  das gefällt, sollten wir reden.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-ink">
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">Die Rolle, die passt</p>
                <ul className="space-y-5 text-xl lg:text-2xl text-ink leading-snug">
                  {["Solutions Engineer", "Implementation Consultant", "Customer Success Manager", "bei Hospitality-Tech-SaaS · DACH"].map((t) => (
                    <li key={t} className="flex gap-4">
                      <span className="text-burgundy">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">Was diese Seite belegt</p>
                <ul className="space-y-5 text-xl lg:text-2xl text-ink leading-snug">
                  {["Branchen-Methode in echten Code übersetzt", "Full-Stack: Next.js · Python · Multi-Agent", "20 Jahre echte Hospitality-Erfahrung", "Dranbleiben: live dokumentiert, Tag für Tag"].map((t) => (
                    <li key={t} className="flex gap-4">
                      <span className="text-burgundy">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 09 · AUTOR ═══ */}
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
                  Spoiler: ich kann es. Noch nicht perfekt, aber jeden Tag mehr. Diese App ist meine
                  Antwort auf zwanzig Jahre Frust mit Foliensätzen — für die Häuser, in denen ich
                  gearbeitet habe, und für die Tech-Teams, die genau diese Häuser verstehen wollen.
                </p>
                <p>
                  Der Wechsel von der Hospitality-Praxis zur Hospitality-Technik war keine Kehrtwende. Eher
                  eine Übersetzung. Diese Seite ist die laufende Beweisaufnahme.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 10 · CTA · ruhig ═══ */}
        <section className="brutal-bg-dark relative overflow-hidden">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">· 09 · Reden wir</p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal-md text-paper">
                <em className="italic-accent text-gold">Schreib mir.</em>
              </h2>
              <p className="mt-10 text-lg lg:text-xl text-paper/80 leading-relaxed max-w-2xl">
                Egal ob du Recruiter bist, Hotelier oder Kollege auf demselben Weg — wenn dich am Projekt
                etwas anzieht, meld dich. Ich antworte meist innerhalb eines Tages.
              </p>
              <div className="mt-14 flex flex-col gap-6">
                <a
                  href="mailto:a.heyers@gmail.com"
                  className="hover-slide font-display italic text-paper hover:text-gold transition-colors"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", lineHeight: 1 }}
                >
                  a.heyers@gmail.com
                </a>
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-paper/60">
                  LinkedIn · /in/alex-heyers
                </p>
              </div>
              <p className="mt-20 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50 max-w-2xl leading-relaxed">
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
