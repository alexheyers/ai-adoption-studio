import Link from "next/link";
import Image from "next/image";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import { StatusPill } from "@/components/StatusPill";
import { getCurrentDay, BOOTCAMP_DAYS } from "@/lib/bootcamp";
import { BUILD_LOG, BUILD_LOG_UPDATED } from "@/lib/build-log";
import { LiveStamp } from "@/components/LiveStamp";
import { WhatIsIt } from "@/components/WhatIsIt";
import AgentsStage from "@/components/AgentsStage";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { HeroLanding } from "@/components/HeroLanding";
import { BuildLogTimeline } from "@/components/BuildLogTimeline";

/**
 * Landing-Page · Build-Log-Reset (27.05.2026).
 * Herzstück = ein detailliertes, ehrliches Build-Log mit den echten täglichen Schritten.
 * Das Log wird automatisch generiert (scripts/gen-build-log.mjs) aus Git-Historie +
 * Kuratier-Schicht (content/build-log.curated.json) + optional freigegebenen Notion-Zeilen.
 * Weniger Pathos, keine Effekthascherei, keine Produkt-/Akquise-Sprache — persönliche
 * Projekt-Doku und zugleich Bewerbung. Keine erfundenen Zahlen.
 */

export default function HomePage() {
  const day = getCurrentDay();

  return (
    <>
      <EditorialHeader />
      <main>
        {/* ═══ 01 · HERO · Editorial-Newsstand (neu 28.05.2026) ═══ */}
        <HeroLanding day={day} total={BOOTCAMP_DAYS} />

        {/* ═══ 00 · WAS IST DAS? · neu 28.05.2026 ═══ */}
        <WhatIsIt />

        {/* ═══ 02 · BUILD-LOG · Timeline + Magazine-Cascade (neu 28.05.2026) ═══ */}
        <BuildLogTimeline />

        {/* ═══ 02b · MARQUEE · Branchen-Vokabular zwischen Log und Warum ═══ */}
        <div className="marquee-mega border-y-0">
          <div className="marquee-mega-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="marquee-mega-item">
                <span>FastAPI</span>
                <span className="marquee-mega-dot">·</span>
                <em>Voice-Agent</em>
                <span className="marquee-mega-dot">·</span>
                <span>Claude Agent SDK</span>
                <span className="marquee-mega-dot">·</span>
                <em>Hospitality</em>
                <span className="marquee-mega-dot">·</span>
                <span>GuV</span>
                <span className="marquee-mega-dot">·</span>
                <em>PMS</em>
                <span className="marquee-mega-dot">·</span>
                <span>F&amp;B</span>
                <span className="marquee-mega-dot">·</span>
                <em>RevPAR</em>
                <span className="marquee-mega-dot">·</span>
                <span>DSGVO</span>
                <span className="marquee-mega-dot">·</span>
                <em>Multi-Agent</em>
                <span className="marquee-mega-dot">·</span>
                <span>Mosbach</span>
                <span className="marquee-mega-dot">·</span>
              </div>
            ))}
          </div>
        </div>

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

        {/* ═══ 07 · PIPELINE · neu als 3D-Sticky-Stack (28.05.2026) ═══ */}
        <AgentsStage />

        {/* ═══ 07d · ANIMIERTE SYSTEM-ARCHITEKTUR · echter Pfad ═══ */}
        <SystemArchitecture />

        {/* ═══ 07b · ÜBERTRAGBAR · kompakter Nachsatz nach der Buehne ═══ */}
        <section id="pipeline" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-20 lg:py-24">
            <div className="grid grid-cols-12 gap-x-8 gap-y-8">
              <div className="col-span-12 lg:col-span-3">
                <p className="eyebrow">· 06.b · Übertragbar</p>
                <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                  Hospitality ist das Beispiel, nicht die Grenze
                </p>
                <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
                  SVG-Schema im Detail →{" "}
                  <Link href="/agents" className="text-burgundy hover-slide">
                    Agents-Seite
                  </Link>
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9">
                <p className="text-lg lg:text-xl text-ink/80 leading-relaxed max-w-3xl">
                  Ich baue das für Hotels, weil ich diese Welt zwanzig Jahre gelebt habe — da bin ich
                  glaubwürdig. Aber die Mechanik dahinter ist{" "}
                  <em className="italic-accent text-burgundy">branchen-blind</em>: andere Daten rein,
                  anderes Wissen eingepflegt — und dieselbe Pipeline arbeitet für eine ganz andere
                  Branche. Das{" "}
                  <em className="italic-accent text-burgundy">Claude Agent SDK</em> als Bausatz darunter
                  bleibt; Agenten sind eigenständige Bausteine mit eigenen Tools — kein Klick-Workflow,
                  sondern echte, prüfbare Software.
                </p>
              </div>
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
