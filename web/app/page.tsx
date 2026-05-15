import Link from "next/link";
import Image from "next/image";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import SpotlightTracker from "@/components/SpotlightTracker";
import AListHoverReveal from "@/components/AListHoverReveal";
import CustomCursor from "@/components/CustomCursor";
import { BuildBanner } from "@/components/BuildBanner";
import { getCurrentDay, BOOTCAMP_DAYS } from "@/lib/bootcamp";
import { BuildTimeline, type BuildEntry } from "@/components/BuildTimeline";
import { StatusPill } from "@/components/StatusPill";

/**
 * Landing-Page · Build-in-Public-Spine.
 * Die Homepage IST der Build-Log. Hero = letzter Build · Timeline = Spine ·
 * Projekt-Kontext, Pain Points, A-List, Schauplätze, Autor folgen darunter
 * als Vertiefung — nicht als Marketing.
 */

const LATEST_BUILD: BuildEntry = {
  day: 10,
  date: "15.05.2026",
  title: "Zweihundert Mails. Sortiert.",
  body:
    "Triage-Agent v0.3 — drei Klassifikations-Buckets (Buchung · Beschwerde · Info) auf zweihundert Test-Mails getestet. Sechzig Prozent direkt korrekt, fünfundzwanzig Prozent mit Confidence-Score unter 0,7 zur Eskalation an einen Menschen. Antwort-Templates Phase 1 in Arbeit.",
  status: "live",
  tag: "Front-Office",
};

const RECENT_BUILDS: BuildEntry[] = [
  {
    day: 8,
    date: "13.05.2026",
    title: "PMS-Exporte gelesen.",
    body:
      "Document-Analyst — CSV-, XLSX- und PDF-Parser steht. Erste Hospitality-Domain-Mappings (Belegung, ADR, RevPAR, OTA-Anteil) gegen vier Beispieldatensätze validiert. Anonymisierung läuft als Pre-Processor.",
    status: "live",
    tag: "Backoffice",
  },
  {
    day: 5,
    date: "10.05.2026",
    title: "Voice-Layer mit Ada — erste Demo.",
    body:
      "Deutsche Voice-Interview-Session funktioniert end-to-end. Pre-Audit-Hypothesen werden noch hart gecoded — dynamische Hypothesen-Generierung aus dem Document-Analyst-Output ist als nächstes dran.",
    status: "building",
    tag: "Voice",
  },
  {
    day: 3,
    date: "08.05.2026",
    title: "Architektur entschieden.",
    body:
      "Stack festgelegt: Next.js direkt in Claude Code, FastAPI für die Agents-Pipeline, Supabase als Datenebene, ElevenLabs für Voice. Kein Lovable — produktnah, deploy-fähig, voll im Zugriff.",
    status: "live",
    tag: "Setup",
  },
  {
    day: 1,
    date: "06.05.2026",
    title: "Tag eins.",
    body:
      "Vor mir 23 Leute, die coden können. Ich nicht. Aufschlag im Vibe Coding Bootcamp — 636 Unterrichtseinheiten, zwölf Wochen Vollzeit, 26 Live-Sessions mit Trainern von Zalando, XING, SumUp, OTTO. Ziel: in 90 Tagen eine Hospitality-App, die einen Recruiter ernstnimmt.",
    status: "live",
    tag: "Kickoff",
  },
];

export default function HomePage() {
  const day = getCurrentDay();

  return (
    <>
      <CustomCursor />
      <SpotlightTracker />
      <BuildBanner lastBuildLabel={LATEST_BUILD.title} />
      <EditorialHeader />
      <main>
        <div className="scroll-progress" aria-hidden />

        {/* ═══════════════ 01 · HERO · LATEST BUILD ═══════════════ */}
        <section className="brutal-bg-dark relative overflow-hidden min-h-[820px] lg:min-h-[920px] flex flex-col">
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 78% 28%, rgba(122,132,113,0.12), transparent 60%), radial-gradient(ellipse at 18% 82%, rgba(107,39,55,0.10), transparent 55%)",
              }}
            />
          </div>

          <div className="flex-1 mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-28 lg:pt-36 pb-20 flex flex-col">
            {/* Live-Status-Eyebrow */}
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
                style={{
                  fontSize: "clamp(1.1rem, 1.9vw, 1.7rem)",
                  letterSpacing: "-0.005em",
                  animationDelay: "120ms",
                }}
              >
                Zwanzig Jahre hat mich die Branche nicht losgelassen.
              </span>

              <span
                className="block hero-fade-in leading-[0.82]"
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3.8rem, 14vw, 15rem)",
                  letterSpacing: "-0.055em",
                  color: "#FAF6EE",
                  animationDelay: "200ms",
                }}
              >
                Jetzt revanchiere
              </span>

              <span
                className="block hero-fade-in leading-[0.82] mt-2 lg:mt-4"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontWeight: 500,
                  fontStyle: "italic",
                  fontSize: "clamp(3.8rem, 14vw, 15rem)",
                  letterSpacing: "-0.045em",
                  color: "#B8945F",
                  animationDelay: "320ms",
                  fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 144',
                }}
              >
                ich mich.
              </span>

              <span
                className="mt-12 lg:mt-16 block max-w-3xl text-paper/85 hero-fade-in"
                style={{
                  fontSize: "clamp(1.1rem, 1.6vw, 1.45rem)",
                  lineHeight: 1.55,
                  animationDelay: "460ms",
                }}
              >
                Eine App für die Hotels, in denen ich gearbeitet habe. Dreißig Minuten Gespräch in
                deutscher Sprache. Zehn Agents, die dein Haus einzeln verstehen — nicht das nächste
                aus dem Template. Ein Bericht, mit dem jemand am Montag um sieben anfängt. Während
                du das hier liest, baue ich. Du siehst jeden Schritt.
              </span>
            </h1>

            {/* Pipeline-Status-Block am unteren Hero-Drittel */}
            <div className="mt-auto pt-16 grid grid-cols-12 gap-x-8 gap-y-6 border-t border-paper/15 hero-fade-in"
                 style={{ animationDelay: "620ms" }}>
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">
                  Pipeline-Status
                </p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight"
                   style={{ fontVariationSettings: '"WONK" 1' }}>
                  <em>Vier von zehn Agents</em> in Funktion.
                  <br />
                  <span className="text-paper/60">Vier im Bau. Zwei geplant.</span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">
                  Letzter Build · {LATEST_BUILD.date}
                </p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight"
                   style={{ fontVariationSettings: '"WONK" 1' }}>
                  <em>Triage-Agent v0.3</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">
                    Reservation-Mails: 60% direkt klassifiziert
                  </span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex flex-col md:items-end md:text-right">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-3">
                  Wer baut
                </p>
                <p className="font-display text-2xl lg:text-3xl text-paper leading-tight"
                   style={{ fontVariationSettings: '"WONK" 1' }}>
                  <em>Alex Heyers</em>
                  <br />
                  <span className="text-paper/60 text-base lg:text-lg">
                    20 Jahre Hospitality · Mosbach
                  </span>
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

        {/* ═══════════════ 02 · BUILD-LOG TIMELINE ═══════════════ */}
        <section id="build-log" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 lg:py-36">
            <div className="grid grid-cols-12 gap-x-8 mb-16 lg:mb-20">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 01 · Build-Log
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Was diese Woche <em className="italic-accent text-burgundy">geboren</em> wurde.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Kein Marketing. Kein Roadmap-Theater. Was ich an einem Tag gebaut habe, steht hier
                  am nächsten Morgen — mit Datum, Status, und manchmal einem ehrlichen "Das hat
                  länger gedauert als gedacht." Wenn ich's geschafft habe, steht's da. Wenn nicht,
                  auch.
                </p>
              </div>
            </div>

            <BuildTimeline entries={RECENT_BUILDS} />

            <div className="mt-12 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                Stand 15.05.2026 · letzte fünf Einträge sichtbar
              </p>
              <Link
                href="/customer-journey"
                className="hover-slide font-mono text-[11px] tracking-eyebrow uppercase text-burgundy"
              >
                Vollständiger Build-Log →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ 03 · MEGA-MARQUEE · Build-Signale ═══════════════ */}
        <section className="marquee-mega">
          <div className="marquee-mega-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-16 shrink-0 pl-16">
                <span className="marquee-mega-item">
                  Tag {day} von {BOOTCAMP_DAYS} <em>· live im Bau ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Vier Agents <em>· in Funktion ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Voice-Interview <em>· auf Deutsch ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Mosbach <em>· DACH · Hospitality ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Pitch <em>· 19.05.2026 ·</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ 04 · MANIFEST ═══════════════ */}
        <section className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                · 02 · Manifest
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">
                Alex Heyers · Mosbach · Mai 2026
              </p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal-md text-ink">
                Ich <em className="italic-accent text-burgundy">liebe</em> diese Branche.
                <br />
                Sie verdient <em className="italic-accent text-burgundy">besseres</em>.
              </h2>

              <div className="mt-16 grid md:grid-cols-2 gap-12 lg:gap-20 text-lg lg:text-xl text-ink/80 leading-relaxed">
                <p className="drop-cap-grand">
                  Service. Bar. Standort. Direktion. Zwanzig Jahre lang dieselbe Welt — und in dieser
                  Zeit kam ein Berater nach dem nächsten ins Haus, mit Folien für eine andere Bäckerei.
                  Sechzigseitig. Sechs Wochen Wartezeit. Achtzigtausend Euro. Am Ende blieb das
                  Wesentliche unberührt: das, was am Samstag um neun wirklich passiert. Mich hat das
                  jahrelang wütend gemacht.
                </p>
                <p>
                  Diese App ist meine Antwort. Kein Foliensatz. Sondern dreißig Minuten Gespräch — in
                  deutscher Sprache, mit etwas, das wirklich zuhört. Zehn spezialisierte Helfer, die
                  danach die Daten deines Hauses ernst nehmen. Am Ende ein Bericht, der nicht klingt
                  wie alle anderen, weil keine zwei Häuser gleich sind. Während du das liest, baue
                  ich. Heute ist Tag {day} von {BOOTCAMP_DAYS}. Frag mich auf der Hälfte nochmal, ob
                  ich's geschafft habe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 05 · BEFUND ═══════════════ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">
              · 03 · Befund
            </p>

            <h2 className="h-brutal text-paper" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
              Acht von zehn
              <br />
              <em className="italic-accent text-burgundy">KI-Strategien</em>
              <br />
              bleiben Papier.
            </h2>

            <p className="mt-16 max-w-2xl text-paper/75 text-lg leading-relaxed">
              Du weißt das. Ich weiß das. Trotzdem unterschreiben Mittelständler diese Audits seit
              fünf Jahren. Drei Gründe, alle vermeidbar:
            </p>

            <ol className="mt-16 grid md:grid-cols-3 gap-12 lg:gap-16">
              <BrutalProblem
                n="i."
                title="Generisch"
                body="Sechzig Seiten aus dem Template. Branche nicht genannt. Region nicht genannt. Wettbewerber nicht genannt. Nach Seite zwölf weißt du: das hätte für eine Bäckerei genauso gepasst. Und du hast noch fünfzig Seiten vor dir."
              />
              <BrutalProblem
                n="ii."
                title="Zu teuer"
                body="Fünfzehntausend bis achtzigtausend Euro. Du unterschreibst es mit Bauchschmerzen, weil dein Beirat es will. Sechs Monate später ist keine einzige Empfehlung live. Niemand fragt nach."
              />
              <BrutalProblem
                n="iii."
                title="Zu langsam"
                body="Sechs Wochen bis zur ersten Empfehlung. In sechs Wochen hat sich der KI-Markt zweimal gedreht. Du bekommst einen Stack vorgeschlagen, der am Tag der Übergabe schon halb veraltet ist."
              />
            </ol>
          </div>
        </section>

        {/* ═══════════════ 05b · MARQUEE-SKEW · Pain-Points ═══════════════ */}
        <div className="marquee-skew">
          <div className="marquee-skew-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 shrink-0 pl-12">
                <span className="marquee-skew-item">Reservierungs-Inbox <em>· Samstag 09:00 ·</em></span>
                <span className="marquee-skew-item">OTA-Margen <em>· über 25% ·</em></span>
                <span className="marquee-skew-item">Antwortzeit Gruppen <em>· 6 bis 14 Stunden ·</em></span>
                <span className="marquee-skew-item">Datensilos <em>· PMS · POS · OTA · Excel ·</em></span>
                <span className="marquee-skew-item">Compliance <em>· DSGVO · TSE · AI-Act ·</em></span>
                <span className="marquee-skew-item">Lieferanten-Mails <em>· ungelesen ·</em></span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 06 · DIE WELT DA DRAUSSEN · OPERATOR NOTES ═══════════════ */}
        <section id="branche" className="brutal-bg-light border-b-2 border-ink scroll-reveal spotlight">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 gap-y-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 04 · Die Welt da draußen
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Wo der Schuh wirklich <em className="italic-accent text-burgundy">drückt</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Vier Beobachtungen. Nicht aus einem Branchen-Report — aus zwanzig Jahren
                  Front-Office bis Direktion, plus dreißig Telefonaten mit ehemaligen Kollegen aus
                  diesem Frühjahr. Wenn du's selbst erlebt hast: nick mit.
                </p>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink">
              <PainCard
                eyebrow="Front-Office · Reservierung"
                title="Samstag, 09:00 Uhr"
                body="Du kennst das Gefühl. Freitag-Abend gegen sieben hörst du den letzten Mail-Ton. Samstag-Morgen um neun ist die Inbox voll: Gruppen-Anfragen, Sonderwünsche, Events, eine wütende Beschwerde, drei Newsletter-Bestätigungen dazwischen. Und genau jetzt steht ein Gast vor der Theke. Du entscheidest gefühlt fünfzig Mal pro Stunde, was wichtiger ist. Das ist kein Pain Point. Das ist dein Wochenende."
                addressedBy="Triage-Agent"
                addressedStatus="building"
                accent
              />
              <PainCard
                eyebrow="Vertrieb · OTA"
                title="Der Margen-Lochfraß"
                body="Achtzehn bis fünfundzwanzig Prozent. So viel frisst Booking pro Buchung. Du weißt seit zwei Jahren, dass Direkt-Vertrieb der einzige Hebel ist. Du hast sogar eine Powerpoint dafür — irgendwo in einem Ordner namens 'Strategie 2024'. Aber dazwischen liegt das tägliche Geschäft. Und das gewinnt jeden Morgen."
                addressedBy="Use-Case-Generator"
                addressedStatus="building"
              />
              <PainCard
                eyebrow="Backoffice · Buchhaltung"
                title="Das Papier am Monatsende"
                body="Lieferantenbelege. Stapel. Per Hand übertragen, weil das System nicht 'ganz' kann. Bankabgleich im Excel. Der Steuerberater wartet bis zum Zehnten — und niemand fragt, dass eine Mitarbeiterin seit drei Jahren freitags Belege erfasst, statt mit den Gästen zu reden. Dazu TSE. DSGVO. AI-Act. Drei Buchstabenketten, die kein Mensch je freiwillig liest."
                addressedBy="Document-Analyst"
                addressedStatus="live"
                accent
              />
              <PainCard
                eyebrow="Operations · Personal"
                title="Der Mensch, den keiner findet"
                body="Nummer eins im DACH-Markt. Drei offene Stellen, kein einziges Vorstellungsgespräch. Du hast bereits den Anzeigentext geändert. Zweimal. Vielleicht ist es nicht der Text. Vielleicht ist es so, dass jede Stunde, die ein System einer Schicht abnimmt, eine Stunde ist, in der ein Mensch wieder mit Gästen reden darf — und sich daran erinnert, warum er angefangen hat."
                addressedBy="Process-Auditor"
                addressedStatus="live"
              />
            </div>

            <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-8">
              <blockquote className="col-span-12 lg:col-span-9 pull-quote">
                Jedes Haus hat seine eigene Wahrheit. Niemand fragt sie ab. Das Tool tut's — entlang
                der Daten, im Gespräch, gegen die Branchen-Benchmarks. Nicht durch Bauchgefühl. Nicht
                durch Workshops. Durch Zuhören.
              </blockquote>
              <aside className="col-span-12 lg:col-span-3 lg:pl-8 lg:border-l-2 lg:border-ink/20">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60 mb-3">
                  Das Studio identifiziert
                </p>
                <ul className="space-y-4 font-mono text-[11px] tracking-eyebrow uppercase text-ink">
                  <li>· Prozess-Hebel über 15 Domains</li>
                  <li>· Hypothesen vor dem Gespräch</li>
                  <li>· Compliance-Risiken</li>
                  <li>· ROI-Pfade haus-spezifisch</li>
                  <li>· Tool-Stack mit Branchen-Tags</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        {/* ═══════════════ 07 · ABLAUF · 5 PHASEN ═══════════════ */}
        <section id="ablauf" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 mb-16 lg:mb-24">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 04½ · Ablauf
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  So läuft eine <em className="italic-accent text-burgundy">Analyse</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Vom ersten Klick bis zur Empfehlung, mit der jemand am Montag anfängt: fünf Phasen.
                  Keine Workshops. Keine Wochen-Termine. Kein achtzigseitiges PDF. Stand heute: zwei
                  laufen, eine ist im Test, zwei warten noch.
                </p>
              </div>
            </div>

            <JourneyTrack
              steps={[
                {
                  n: "01",
                  eyebrow: "Onboarding",
                  title: "Daten aus dem Haus",
                  body:
                    "PMS-Exporte, Inventur, Wettbewerbs-Reports, OTA-Statistik — alles was vorhanden ist, hochgeladen und vom Document-Analyst eingelesen. Funktioniert seit Tag 7.",
                  status: "live",
                },
                {
                  n: "02",
                  eyebrow: "Voice-Interview",
                  title: "Dreißig Minuten mit Ada",
                  body:
                    "Senior-Consultant-Gespräch in deutscher Sprache. Pre-Audit-Hypothesen werden gegen die Realität im Haus geprüft. Voice-Layer steht, Hypothesen-Generator wird gerade befüllt.",
                  status: "building",
                },
                {
                  n: "03",
                  eyebrow: "Pipeline",
                  title: "Zehn Agents arbeiten",
                  body:
                    "Prozess-Audit über 15 Domains, Use-Case-Generator mit VUFVE-Filter, Tool-Recommender, ROI-Modell, Compliance-Check — parallel, dokumentiert. Vier von zehn heute funktional.",
                  status: "building",
                },
                {
                  n: "04",
                  eyebrow: "Report",
                  title: "Executive Summary",
                  body:
                    "Ein lesbarer Bericht. Pain-Hebel, Use-Cases, Tools, Cashflow-Pfade, Compliance-Flags. Nichts vom Template — alles aus den Daten des Hauses.",
                  status: "planned",
                },
                {
                  n: "05",
                  eyebrow: "Roadmap",
                  title: "Drei Phasen Umsetzung",
                  body:
                    "Quick-Wins, Standard-Hebel, strategische Initiativen. Mit Verantwortlichkeit, Aufwand und Effekt. Das, womit jemand am Montag anfängt.",
                  status: "planned",
                },
              ]}
            />
          </div>
        </section>

        {/* ═══════════════ 08 · A-LIST · 10 AGENTS · STATUS-PILLS ═══════════════ */}
        <section id="pipeline" className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 mb-20">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">
                  · 05 · A-List
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-paper" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
                  Zehn <em className="italic-accent text-burgundy">Spezialisten</em>.
                  <br />
                  Eine <em className="italic-accent text-gold">Pipeline</em>.
                </h2>
                <p className="mt-8 text-lg text-paper/70 leading-relaxed max-w-2xl">
                  Kein Mega-Prompt, der alles soll und nichts richtig kann. Stattdessen zehn
                  spezialisierte Mini-Berater. Jeder mit klarem Job, überprüfbarem Output,
                  Hospitality-Anker. Wie eine gute Brigade in der Küche: keiner macht alles, aber
                  alle wissen, was als nächstes auf den Pass kommt.
                </p>
              </div>
            </div>

            <AListHoverReveal agents={AGENTS_WITH_IMG} />

            {/* Status-Übersicht — Liste mit Pills */}
            <ul className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-3 border-t border-paper/15 pt-12">
              {AGENTS_WITH_IMG.map((a) => (
                <li
                  key={a.n}
                  className="flex items-center gap-4 py-2 border-b border-paper/10 last:border-b-0"
                >
                  <span className="font-mono text-[10px] tracking-eyebrow uppercase text-gold w-8 shrink-0">
                    {a.n}
                  </span>
                  <span className="font-display text-lg text-paper flex-1"
                        style={{ fontVariationSettings: '"WONK" 1' }}>
                    <em>{a.name}</em>
                    <span className="text-paper/50 font-sans text-sm not-italic ml-3">— {a.role}</span>
                  </span>
                  <StatusPill status={a.status} light />
                </li>
              ))}
            </ul>

            <div className="mt-12 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
                Stand {LATEST_BUILD.date} · vier in Funktion · vier im Bau · zwei geplant
              </p>
              <Link
                href="/agents"
                className="hover-slide font-mono text-[11px] tracking-eyebrow uppercase text-paper"
              >
                Volle Übersicht →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ 08b · CINEMATIC IMAGE-BREAK ═══════════════ */}
        <section className="cinematic-break border-b-2 border-ink">
          <Image
            src="/scene-onboarding-upload.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover parallax-slow"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-10 z-10">
            <div className="mx-auto max-w-[1600px] w-full">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-8 scroll-reveal">
                · Zwischenakt
              </p>
              <p
                className="text-paper scroll-reveal"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(2.5rem, 7vw, 7rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  maxWidth: "20ch",
                }}
              >
                Die Daten Ihres Hauses werden zum
                <br />
                <span className="text-gold italic-accent">Rohstoff der Beratung</span>.
              </p>
              <p className="mt-10 font-mono text-[11px] tracking-eyebrow uppercase text-paper/70 max-w-md scroll-reveal">
                Reports, Inventur-Listen, PMS-Exports, Wettbewerbsdaten, OTA-Reports — eingelesen,
                verstanden, gegen Branchen-Benchmarks verglichen.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ 09 · SCHAUPLÄTZE ═══════════════ */}
        <section id="wo-es-hilft" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 mb-20">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 06 · Schauplätze
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
                  Drei Momente.
                  <br />
                  Drei <em className="italic-accent text-burgundy">Hebel</em>.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-xl">
                  Hospitality-Alltag ist eine Aneinanderreihung kleiner Entscheidungen, die niemand
                  außer dir sieht. Hier sind drei davon — und was das Tool macht, wenn es fertig
                  ist.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6 gap-y-20">
              <figure className="col-span-12 md:col-span-7">
                <div className="relative aspect-[3/2] overflow-hidden bg-ink group scroll-mask">
                  <Image
                    src="/scene-reception-overload.jpg"
                    alt="Front-Office unter Volllast"
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-6 grid grid-cols-12 gap-x-4">
                  <span className="col-span-2 brutal-rank text-burgundy">01</span>
                  <div className="col-span-10">
                    <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">
                      Front-Office · Reservierungs-Mails
                    </p>
                    <p className="mt-3 h-brutal-sm text-ink">
                      Drei Leitungen, <em className="italic-accent text-burgundy">zweihundert Mails</em> — und ein Gast vor der Theke.
                    </p>
                    <p className="mt-3 text-ink/70 max-w-md leading-relaxed">
                      Du brauchst keinen weiteren Workshop, du brauchst zurück deine Stunden. Der
                      Use-Case-Generator nennt dir drei AI-Inbox-Stacks für genau deine Volumen-Kurve —
                      mit Antwortzeit-Benchmark, Vendor-Namen, ehrlicher Implementierungs-Zeit.
                    </p>
                  </div>
                </figcaption>
              </figure>

              <figure className="col-span-12 md:col-span-5 md:mt-24">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink group scroll-mask">
                  <Image
                    src="/scene-backoffice-paperwork.jpg"
                    alt="Backoffice mit Papier-Bergen"
                    fill
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-6 grid grid-cols-12 gap-x-4">
                  <span className="col-span-2 brutal-rank text-burgundy">02</span>
                  <div className="col-span-10">
                    <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">
                      Backoffice · Rechnungs-Verarbeitung
                    </p>
                    <p className="mt-3 h-brutal-sm text-ink">
                      Belege per Hand. <em className="italic-accent text-burgundy">Übertragsfehler</em>. Steuerberater wartet.
                    </p>
                    <p className="mt-3 text-ink/70 max-w-md leading-relaxed">
                      Niemand wird zum Hotelier, um Belege abzutippen. Trotzdem passiert genau das,
                      jeden Freitag, in jedem Haus. Die Tools-DB filtert TSE-konforme OCR-Lösungen —
                      inklusive DSGVO-Hosting-Pflicht und AVV-Check. Konkret: "Tool X passt zu deinem
                      Datenstand, kostet Y, ist in Z Wochen live."
                    </p>
                  </div>
                </figcaption>
              </figure>

              <figure className="col-span-12 md:col-span-11 md:col-start-2">
                <div className="relative aspect-[21/9] overflow-hidden bg-ink group scroll-mask">
                  <Image
                    src="/scene-director-report.jpg"
                    alt="Direktor liest Executive-Summary"
                    fill
                    sizes="(min-width: 768px) 92vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-6 grid grid-cols-12 gap-x-4">
                  <span className="col-span-2 brutal-rank text-burgundy">03</span>
                  <div className="col-span-10 lg:col-span-7">
                    <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">
                      Direktion · Strategische Klarheit
                    </p>
                    <p className="mt-3 h-brutal-sm text-ink">
                      Am Ende ein <em className="italic-accent text-burgundy">Bericht</em>, den jemand wirklich umsetzt.
                    </p>
                    <p className="mt-3 text-ink/70 leading-relaxed max-w-2xl">
                      Drei Seiten. Nicht achtzig. Investment, Savings, Payback, drei Phasen
                      Umsetzung. Lesbar für jemanden, der eine Schicht zu führen hat — nicht für
                      einen Beirat, der's danach in eine Schublade legt. Der Reporter-Agent
                      verdichtet zehn Agenten-Outputs zu dem, was am Montag um sieben auf deinem
                      Schreibtisch liegen sollte.
                    </p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ═══════════════ 10 · KONTEXT · BEWERBUNG ═══════════════ */}
        <section id="kontext" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 mb-20">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 07 · Kontext
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
                  Für wen das hier <em className="italic-accent text-burgundy">gebaut</em> ist.
                </h2>
                <p className="mt-8 text-lg text-ink/70 max-w-xl leading-relaxed">
                  Ehrlich: diese Seite ist auch eine Bewerbung. Ab August 2026 — DACH, Remote, Vollzeit
                  oder Senior-Freelance. Wenn dir das hier gefällt, was du gerade siehst, dann
                  reden wir.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-ink">
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">
                  Wer ich treffe
                </p>
                <ul className="space-y-6 text-xl lg:text-2xl text-ink leading-snug">
                  <ContextRow text="Hospitality-Tech-Anbieter (Apaleo, Mews, Apicbase, Choco, orderbird, SIDES)" />
                  <ContextRow text="Digital-Agenturen mit Hospitality-Vertical" />
                  <ContextRow text="Hotel-Gruppen mit eigenem Digital-Lead-Bedarf" />
                  <ContextRow text="Beratungen für Digitalisierung im Gastgewerbe" />
                </ul>
              </div>
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">
                  Was diese Seite belegt
                </p>
                <ul className="space-y-6 text-xl lg:text-2xl text-ink leading-snug">
                  <ContextRow text="Senior-Consultant-Methode in Code übersetzbar" />
                  <ContextRow text="Full-Stack: Next.js · Python · Supabase · Multi-Agent-LLM" />
                  <ContextRow text="Hospitality-DNA: zwanzig Jahre Front-Office bis Direktion" />
                  <ContextRow text="Build-in-Public-Disziplin: 90 Tage · 26 Posts · ein lebendes Produkt" />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 11 · AUTOR ═══════════════ */}
        <section id="author" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40 grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                · 08 · Autor
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="relative aspect-square overflow-hidden bg-ink scroll-mask">
                <Image
                  src="/alex-heyers-portrait.jpg"
                  alt="Alex Heyers"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-eyebrow uppercase text-ink/50">
                Fig. 1 · Mosbach · MMXXVI
              </p>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}>
                Alex
                <br />
                <em className="italic-accent text-burgundy">Heyers</em>.
              </h2>
              <p className="mt-6 font-mono text-[11px] tracking-eyebrow uppercase text-ink/60">
                Mosbach · 20 Jahre Hospitality · Vibe Coder im Bootcamp 2026
              </p>
              <div className="mt-10 space-y-6 text-lg text-ink/80 leading-[1.7]">
                <p>
                  Zwanzig Jahre Branchenwege. Service, Bar, Standort, Direktion — in dieser
                  Reihenfolge, mit den Schrammen, die dazugehören. 2024 die eigene
                  Digital-Strategie-Boutique aufgebaut. 2025 Vater geworden, und damit ein neuer
                  Maßstab dafür, was Zeit eigentlich wert ist. 2026 zurück auf die Schulbank — drei
                  Monate Vibe Coding Bootcamp, weil ich wissen wollte, ob ich das, was Berater immer
                  nur versprechen, selbst bauen kann.
                </p>
                <p>
                  Spoiler: ich kann's. Noch nicht perfekt, aber jeden Tag mehr. Diese App ist die
                  Antwort auf zwanzig Jahre Frust mit Foliensätzen. Nicht für einen Konzern, sondern
                  für die mittelständischen Häuser, in denen ich gearbeitet habe — und für die
                  Tech-Anbieter, die genau diese Häuser bedienen wollen, aber selten jemanden im
                  Team haben, der dort wirklich gestanden hat.
                </p>
                <p>
                  Der Wechsel von Hospitality-Praxis zu Hospitality-Tech war keine Karriere-Wendung.
                  Er war eine Übersetzung. Diese Seite ist die laufende Beweisaufnahme.
                </p>
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-ink/50">
                  Bootcamp · 06.05.–30.07.2026 · Pitch 19.05. · Final-Pitch 21.07.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 12 · CLOSER · ANFRAGE ═══════════════ */}
        <section className="brutal-bg-dark relative overflow-hidden scroll-reveal spotlight">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-[-6%] parallax-slow">
              <Image
                src="/scene-roadmap-planning.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-50 mix-blend-luminosity"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(10,10,10,0.85), rgba(10,10,10,0.60) 60%, rgba(107,39,55,0.4))",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />
          </div>
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-40 lg:py-56 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold">
                · 09 · Anfrage
              </p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal text-paper">
                <em className="italic-accent text-gold">Bis hierher gescrollt?</em>
              </h2>
              <p className="mt-10 text-lg lg:text-xl text-paper/80 leading-relaxed max-w-2xl">
                Dann zieht dich am Projekt etwas an. Vielleicht die Branche. Vielleicht der Ansatz.
                Vielleicht die Vorstellung, dass jemand zwanzig Jahre lang gewartet hat, um endlich
                selbst zu bauen, was er sich immer gewünscht hat. Egal ob du Recruiter bist,
                Hotelier oder Kollege auf dem Weg — schreib mir. Antwort kommt unter
                vierundzwanzig Stunden.
              </p>
              <div className="mt-16 flex flex-col gap-6">
                <a
                  href="mailto:a.heyers@gmail.com"
                  className="hover-slide font-display italic text-paper hover:text-gold transition-colors"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                    fontVariationSettings: '"WONK" 1',
                    lineHeight: 1,
                  }}
                >
                  a.heyers@gmail.com
                </a>
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-paper/60">
                  LinkedIn · /in/alex-heyers · Antwortzeit unter 24 Stunden
                </p>
              </div>
              <p className="mt-24 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50 max-w-2xl leading-relaxed">
                Im Gespräch für · Solutions Engineer · Implementation Consultant · Customer Success
                bei Hospitality-Tech-SaaS · DACH-Remote · Vollzeit ab 01.08.2026
              </p>
            </div>
          </div>
        </section>
      </main>
      <EditorialFooter />
    </>
  );
}

/* ── DATA ──────────────────────────────────────────── */

type AgentStatus = "live" | "building" | "planned";

const AGENTS_WITH_IMG: { n: string; name: string; role: string; img: string; status: AgentStatus }[] = [
  { n: "00", name: "Web-Research",       role: "Vor-Recherche pro Haus",       img: "/scene-onboarding-upload.jpg",   status: "live"     },
  { n: "01", name: "Pre-Audit-Analyst",  role: "Hypothesen vor dem Gespräch",  img: "/scene-director-report.jpg",     status: "building" },
  { n: "02", name: "Document-Analyst",   role: "PMS / POS / OTA-Analyse",      img: "/scene-backoffice-paperwork.jpg",status: "live"     },
  { n: "03", name: "Process-Auditor",    role: "15 Hospitality-Domains",       img: "/scene-reception-overload.jpg",  status: "live"     },
  { n: "04", name: "Use-Case-Generator", role: "VUFVE-Filter pro Haus",        img: "/scene-roadmap-planning.jpg",    status: "building" },
  { n: "05", name: "Tool-Recommender",   role: "Stack + TSE/DSGVO-Check",      img: "/scene-onboarding-upload.jpg",   status: "building" },
  { n: "06", name: "ROI-Calculator",     role: "Cashflow · Payback",           img: "/scene-director-report.jpg",     status: "planned"  },
  { n: "07", name: "Compliance-Checker", role: "DSGVO · TSE · AI-Act",         img: "/scene-backoffice-paperwork.jpg",status: "planned"  },
  { n: "08", name: "Roadmap-Generator",  role: "3-Phasen-Plan",                img: "/scene-roadmap-planning.jpg",    status: "planned"  },
  { n: "09", name: "Reporter",           role: "Executive Summary",            img: "/scene-voice-interview.jpg",     status: "building" },
];

/* ── COMPONENTS ────────────────────────────────────── */

function BrutalProblem({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border-t-2 border-paper/30 pt-6">
      <p
        className="font-display italic text-burgundy text-3xl"
        style={{ fontVariationSettings: '"WONK" 1' }}
      >
        {n}
      </p>
      <p className="mt-4 h-brutal-sm text-paper">{title}</p>
      <p className="mt-4 text-paper/70 leading-relaxed">{body}</p>
    </li>
  );
}

function PainCard({
  eyebrow,
  title,
  body,
  addressedBy,
  addressedStatus,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  addressedBy?: string;
  addressedStatus?: "live" | "building" | "planned";
  accent?: boolean;
}) {
  return (
    <div className="bg-paper p-8 lg:p-10 group hover:bg-paper2 transition-colors duration-500 spotlight flex flex-col">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
        · {eyebrow}
      </p>
      <p
        className={`mt-8 font-display text-3xl lg:text-4xl leading-[1.0] ${accent ? "text-burgundy" : "text-ink"}`}
        style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1, "opsz" 144' }}
      >
        <em>{title}</em>
      </p>
      <p className="mt-6 text-ink/70 leading-relaxed text-sm flex-1">{body}</p>
      {addressedBy && addressedStatus && (
        <div className="mt-6 pt-4 border-t border-ink/15 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[9px] tracking-eyebrow uppercase text-ink3">
            Adressiert von
          </span>
          <span className="font-display italic text-ink text-base" style={{ fontVariationSettings: '"WONK" 1' }}>
            <em>{addressedBy}</em>
          </span>
          <StatusPill status={addressedStatus} />
        </div>
      )}
    </div>
  );
}

type Step = { n: string; eyebrow: string; title: string; body: string; status: AgentStatus };

function JourneyTrack({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      <div className="hidden lg:block absolute left-0 right-0 top-[88px] h-px bg-ink/20" />
      <div className="lg:hidden absolute left-7 top-12 bottom-12 w-px bg-ink/20" />

      <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
        {steps.map((s, idx) => (
          <li key={s.n} className="relative scroll-reveal">
            <div className="flex lg:block items-center gap-4 mb-6 lg:mb-12">
              <span
                className="relative z-10 flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-burgundy text-paper font-mono text-sm lg:text-base font-medium tracking-wide shrink-0 shadow-[0_8px_24px_-8px_rgba(107,39,55,0.5)] transition-transform duration-500 group-hover:scale-110"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {s.n}
              </span>
              <span className="lg:hidden font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                · {s.eyebrow}
              </span>
            </div>

            <div className="lg:pl-0 lg:pr-4">
              <div className="hidden lg:flex items-center gap-3 mb-3">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                  · {s.eyebrow}
                </p>
                <StatusPill status={s.status} />
              </div>
              <div className="lg:hidden mb-3">
                <StatusPill status={s.status} />
              </div>
              <p
                className="font-display text-2xl lg:text-3xl xl:text-4xl text-ink leading-[1.05] mb-4"
                style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1, "opsz" 144' }}
              >
                <em>{s.title}</em>
              </p>
              <p className="text-ink/70 leading-relaxed text-sm lg:text-base">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ContextRow({ text }: { text: string }) {
  return (
    <li className="flex gap-4 items-baseline">
      <span className="text-burgundy text-2xl shrink-0">→</span>
      <span className="ul-reveal">{text}</span>
    </li>
  );
}
