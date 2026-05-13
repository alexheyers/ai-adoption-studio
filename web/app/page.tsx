import Link from "next/link";
import Image from "next/image";
import { EditorialHeader, EditorialFooter } from "@/components/Layout";
import SpotlightTracker from "@/components/SpotlightTracker";
import AListHoverReveal from "@/components/AListHoverReveal";
import CustomCursor from "@/components/CustomCursor";

/**
 * Landing-Page · GWA-Brutalism × Editorial-Quiet-Luxury.
 * Style-Anker: germanwebawards.com — massive Sans-Display, italic-underlined
 * Akzentwörter, numerische Hierarchie, hard-cut Schwarz-Weiß. Plus 2026-Trends:
 * Scroll-Driven, Glassmorphism, Parallax, Magnetic, Spotlight.
 * Story: Portfolio-Showcase von Alex Heyers — 20 Jahre Hospitality → Multi-Agent-Tech.
 */

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <SpotlightTracker />
      <EditorialHeader />
      <main>
        {/* Scroll-Progress-Bar (fixed top, CSS scroll-timeline) */}
        <div className="scroll-progress" aria-hidden />

        {/* ═══════════════ 01 · TYPOGRAPHY HERO · GWA-Pattern ═══════════════ */}
        <section className="brutal-bg-dark relative overflow-hidden min-h-[860px] lg:min-h-[940px] flex flex-col">
          {/* nur ein extrem subtiler Vignette-Gradient, KEIN Hero-Foto */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0"
                 style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(107,39,55,0.10), transparent 60%)" }} />
          </div>

          {/* Reines Typography-Hero · keine Eyebrows, keine CTA, keine Bilder */}
          <div className="flex-1 mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-32 lg:pt-40 pb-24 flex flex-col">
            <h1 style={{ color: "#FAF6EE" }}>
              {/* kleine Vorzeile */}
              <span className="block font-sans font-medium mb-6 hero-fade-in"
                    style={{
                      fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)",
                      letterSpacing: "-0.01em",
                      color: "#FAF6EE",
                    }}>
                AI-Adoption für
              </span>

              {/* MEGA-Wort · auf Mobile auto-fit per font-size-clamp */}
              <span className="block hero-fade-in leading-[0.82]"
                    style={{
                      fontFamily: "var(--font-sans), sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(3.8rem, 15vw, 17rem)",
                      letterSpacing: "-0.06em",
                      color: "#FAF6EE",
                      animationDelay: "120ms",
                      wordBreak: "break-word",
                      hyphens: "none",
                    }}>
                Hospitality
              </span>

              {/* Adjektiv-Folge · jeweils eigene Zeile · italic + thin underline */}
              <span className="mt-10 lg:mt-14 block leading-[1.05]"
                    style={{
                      fontFamily: "var(--font-display), Georgia, serif",
                      fontWeight: 500,
                      fontStyle: "italic",
                      fontSize: "clamp(2.5rem, 8vw, 7.5rem)",
                      letterSpacing: "-0.025em",
                      color: "#FAF6EE",
                    }}>
                <HeroAdj delay={240}>senior.</HeroAdj>
                <HeroAdj delay={320}>spezifisch.</HeroAdj>
                <HeroAdj delay={400}>shippable.</HeroAdj>
                <HeroAdj delay={480}>branchen-tief.</HeroAdj>
                <HeroAdj delay={560}>voice-first.</HeroAdj>
                <HeroAdj delay={640}>kompliant.</HeroAdj>
              </span>
            </h1>
          </div>

          {/* Footer-Marker (klein, unauffällig) */}
          <div className="border-t border-paper/15">
            <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-5 flex items-center justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
              <span>AI-Adoption-Studio · MMXXVI</span>
              <span className="hidden md:inline">By Alex Heyers · Hospitality DACH</span>
              <span>↓ Scroll</span>
            </div>
          </div>
        </section>

        {/* ═══════════════ 02 · MEGA-MARQUEE · WOW #1 ═══════════════ */}
        <section className="marquee-mega">
          <div className="marquee-mega-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-16 shrink-0 pl-16">
                <span className="marquee-mega-item">
                  Hospitality <em>reimagined.</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Voice <em>first.</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Senior <em>method.</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Branchen <em>tief.</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
                <span className="marquee-mega-item">
                  Made by <em>Alex Heyers.</em>
                  <span className="marquee-mega-dot">●</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ 03 · MANIFEST ═══════════════ */}
        <section className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40 grid grid-cols-12 gap-x-8">
            <div className="col-span-12 lg:col-span-2">
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                · 02 · Manifest
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">
                Alex Heyers · Mai 2026
              </p>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <h2 className="h-brutal-md text-ink">
                Gute Beratung beginnt mit <em className="italic-accent text-burgundy">Zuhören</em>.<br />
                Nicht mit <em className="italic-accent text-burgundy">Slides</em>.
              </h2>

              <div className="mt-16 grid md:grid-cols-2 gap-12 lg:gap-20 text-lg lg:text-xl text-ink/80 leading-relaxed">
                <p className="drop-cap-grand">
                  Wer schon einmal eine Beratungs-Agentur ins Haus geholt hat, kennt das Gefühl: Foliensatz an Tag eins, Workshop an Tag zwei, Rechnung an Tag drei — und das Haus-Gefühl nirgendwo abgebildet. Ich habe zwanzig Jahre auf der anderen Seite gestanden. Service. Bar. Standort-Leitung. Direktion.
                </p>
                <p>
                  Dieses Studio ist mein Versuch, das Gegenteil zu bauen. Nicht ein Foliensatz auf einmal. Sondern ein Werkzeug, das wirklich zuhört, die Daten in den Dokumenten ernst nimmt, dreißig bis vierzig Minuten Senior-Consultant-Gespräch in deutscher Sprache führt — und am Ende einen Bericht liefert, den jemand operativ umsetzen kann.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 04 · PROBLEM · BIG-TYPE STATEMENT ═══════════════ */}
        <section className="brutal-bg-dark border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-12">
              · 03 · Befund
            </p>

            <h2 className="h-brutal text-paper" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
              Acht von zehn<br />
              <em className="italic-accent text-burgundy">KI-Strategien</em><br />
              bleiben Papier.
            </h2>

            <ol className="mt-24 grid md:grid-cols-3 gap-12 lg:gap-16">
              <BrutalProblem n="i." title="Generisch" body="60-Seiten-Strategie-PDFs aus dem Template. Branche, Region, Wettbewerber — kein einziges Mal namentlich genannt." />
              <BrutalProblem n="ii." title="Zu teuer" body="15.000 bis 80.000 Euro für ein Audit, das ein Mittelständler mit Bauchschmerzen unterschreibt. Kein Use-Case läuft am Ende live." />
              <BrutalProblem n="iii." title="Zu langsam" body="Sechs bis zwölf Wochen bis zur ersten konkreten Empfehlung. Der KI-Markt dreht sich in dieser Zeit zweimal." />
            </ol>
          </div>
        </section>

        {/* ═══════════════ 04b · DIAGONAL-SKEWED-MARQUEE · Pain-Points ═══════════════ */}
        <div className="marquee-skew">
          <div className="marquee-skew-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 shrink-0 pl-12">
                <span className="marquee-skew-item">OTA-Provisionen <em>· fressen Margen ·</em></span>
                <span className="marquee-skew-item">Antwortzeiten <em>· über Nacht verloren ·</em></span>
                <span className="marquee-skew-item">Personalmangel <em>· in jedem Haus ·</em></span>
                <span className="marquee-skew-item">Datensilos <em>· PMS · POS · OTA · Excel ·</em></span>
                <span className="marquee-skew-item">Compliance <em>· DSGVO · TSE · AI-Act ·</em></span>
                <span className="marquee-skew-item">Manuelle Prozesse <em>· Stunden pro Tag ·</em></span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 05 · BRANCHEN-REALITÄT (kein konkreter Case) ═══════════════ */}
        <section id="branche" className="brutal-bg-light border-b-2 border-ink scroll-reveal spotlight">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 gap-y-16">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 04 · Branche
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal-md text-ink">
                  Wo der Schuh im <em className="italic-accent text-burgundy">Hospitality-Mittelstand</em> drückt.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-2xl">
                  Die Probleme sind branchenweit dieselben — nur die Ausprägung unterscheidet sich. Personal, Datensilos, Margen, Reaktionszeiten, Compliance. Das Tool deckt sie strukturiert auf, statt zu raten.
                </p>
              </div>
            </div>

            {/* Bento-Grid · Hospitality-Pain-Punkte · qualitativ, keine Zahlen */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink">
              <PainCard
                eyebrow="Front-Office"
                title="Reservierungs-Inbox"
                body="Anfragen aus drei Kanälen, Antwortzeit oft über Nacht. Direkt-Buchungen gehen verloren, weil das Haus nicht schnell genug zurückkommt."
                accent
              />
              <PainCard
                eyebrow="Vertrieb · OTA"
                title="Margen-Druck"
                body="Provisionen fressen einen großen Teil des Zimmer-Erlöses. Direkt-Vertrieb ist der Hebel — aber niemand hat Zeit für Funnel-Arbeit."
              />
              <PainCard
                eyebrow="Backoffice"
                title="Papier-Prozesse"
                body="Belege per Hand, Bankabgleich im Excel, Steuerberater wartet. TSE-, DSGVO- und AI-Act-Vorgaben kommen oben drauf."
                accent
              />
              <PainCard
                eyebrow="Operations"
                title="Personal-Knappheit"
                body="#1 Pain im DACH-Markt. Jede manuelle Tätigkeit, die ein System übernehmen kann, schafft Zeit für die Tätigkeiten, die Gäste spüren."
              />
            </div>

            {/* Statement statt KPI */}
            <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-8">
              <blockquote className="col-span-12 lg:col-span-9 pull-quote">
                Jedes Haus hat seine eigene Wahrheit. Das Tool findet sie — entlang der Daten, im Gespräch, gegen die Branchen-Benchmarks. Nicht durch Bauchgefühl.
              </blockquote>
              <aside className="col-span-12 lg:col-span-3 lg:pl-8 lg:border-l-2 lg:border-ink/20">
                <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60 mb-3">
                  Das Studio identifiziert
                </p>
                <ul className="space-y-4 font-mono text-[11px] tracking-eyebrow uppercase text-ink">
                  <li>· Prozess-Hebel über 15 Domains</li>
                  <li>· Hypothesen vor dem Gespräch</li>
                  <li>· Compliance-Risiken</li>
                  <li>· ROI-Pfade Haus-spezifisch</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        {/* ═══════════════ 05b · CUSTOMER-JOURNEY · 5 PHASEN als Step-Track ═══════════════ */}
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
                  Fünf Phasen vom Daten-Upload bis zur fertigen Roadmap. Keine Workshops, keine Wochen-Termine, kein 80-Seiten-PDF aus dem Template — nur das, was operativ etwas verändert.
                </p>
              </div>
            </div>

            {/* 5-Phasen Track · horizontaler Connect-Flow mit Phase-Karten */}
            <JourneyTrack
              steps={[
                { n: "01", eyebrow: "Onboarding",      title: "Daten aus dem Haus",         body: "PMS-Exporte, Inventur, Wettbewerbs-Reports, OTA-Statistik — alles was vorhanden ist, direkt hochgeladen und vom Document-Analyst eingelesen." },
                { n: "02", eyebrow: "Voice-Interview", title: "30 Minuten mit Ada",          body: "Senior-Consultant-Gespräch in deutscher Sprache. Pre-Audit-Hypothesen werden gegen die Realität im Haus geprüft. Kein Fragebogen — ein Gespräch." },
                { n: "03", eyebrow: "Pipeline",        title: "Zehn Agents arbeiten",        body: "Prozess-Audit über 15 Domains, Use-Case-Generator mit VUFVE-Filter, Tool-Recommender, ROI-Modell, Compliance-Check — parallel, dokumentiert." },
                { n: "04", eyebrow: "Report",          title: "Executive Summary",           body: "Ein lesbarer Bericht. Pain-Hebel, Use-Cases, Tools, Cashflow-Pfade, Compliance-Flags. Nichts vom Template — alles aus den Daten des Hauses." },
                { n: "05", eyebrow: "Roadmap",         title: "Drei Phasen Umsetzung",       body: "Quick-Wins, Standard-Hebel, strategische Initiativen. Mit Verantwortlichkeit, Aufwand und Effekt. Das, womit jemand am Montag anfangen kann." },
              ]}
            />
          </div>
        </section>

        {/* ═══════════════ 06 · A-LIST · 10 AGENTS (GWA Ranking-Style) ═══════════════ */}
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
                  Zehn <em className="italic-accent text-burgundy">Spezialisten</em>.<br />
                  Eine <em className="italic-accent text-gold">Pipeline</em>.
                </h2>
              </div>
            </div>

            {/* WOW #3 · A-List mit Cursor-Following Image-Preview pro Agent */}
            <AListHoverReveal agents={AGENTS_WITH_IMG} />

            <div className="mt-12 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-paper/50">
                Kein Mega-Prompt. Kette aus Mini-Senior-Beratern mit klarem Job, überprüfbarem Output, Branchen-Anker.
              </p>
              <Link href="/agents" className="hover-slide font-mono text-[11px] tracking-eyebrow uppercase text-paper">
                Volle Übersicht →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ 06b · CINEMATIC IMAGE-BREAK · WOW #4 ═══════════════ */}
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
              <p className="text-paper scroll-reveal"
                 style={{
                   fontFamily: "var(--font-display), Georgia, serif",
                   fontStyle: "italic",
                   fontWeight: 500,
                   fontSize: "clamp(2.5rem, 7vw, 7rem)",
                   lineHeight: 1,
                   letterSpacing: "-0.03em",
                   maxWidth: "20ch",
                 }}>
                Die Daten Ihres Hauses werden zum<br />
                <span className="text-gold italic-accent">Rohstoff der Beratung</span>.
              </p>
              <p className="mt-10 font-mono text-[11px] tracking-eyebrow uppercase text-paper/70 max-w-md scroll-reveal">
                Reports, Inventur-Listen, PMS-Exports, Wettbewerbsdaten, OTA-Reports — eingelesen, verstanden, gegen Branchen-Benchmarks verglichen.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ 07 · SCHAUPLÄTZE · HOTEL-SZENEN ═══════════════ */}
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
                  Wo das Tool im<br />
                  <em className="italic-accent text-burgundy">Hotel-Alltag</em> ansetzt.
                </h2>
                <p className="mt-8 text-lg text-ink/70 leading-relaxed max-w-xl">
                  Drei Momente aus dem Hospitality-Alltag. Drei Punkte, an denen ein Multi-Agent-System spürbar entlastet — keine Berater-Slides, Praxis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6 gap-y-20">
              {/* — i. Front-Office — */}
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
                      Use-Case-Generator priorisiert exakt diese Engpässe — mit Antwortzeit-Benchmark und passendem AI-Inbox-Stack.
                    </p>
                  </div>
                </figcaption>
              </figure>

              {/* — ii. Backoffice — */}
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
                      Tools-DB filtert TSE-konforme OCR-Lösungen — inklusive DSGVO-Hosting-Pflicht und AVV-Check.
                    </p>
                  </div>
                </figcaption>
              </figure>

              {/* — iii. Direktion — */}
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
                      Am Ende des Tages ein <em className="italic-accent text-burgundy">Bericht</em>, den jemand umsetzen kann.
                    </p>
                    <p className="mt-3 text-ink/70 leading-relaxed max-w-2xl">
                      Reporter-Agent verdichtet zehn Agenten-Outputs zu einer Executive-Summary mit Investment, Savings, Payback — und einer 3-Phasen-Roadmap.
                    </p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ═══════════════ 08 · KONTEXT · BEWERBUNG ═══════════════ */}
        <section id="preise" className="brutal-bg-light border-b-2 border-ink scroll-reveal">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32 lg:py-40">
            <div className="grid grid-cols-12 gap-x-8 mb-20">
              <div className="col-span-12 lg:col-span-2">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy">
                  · 07 · Kontext
                </p>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
                  Für wen das <em className="italic-accent text-burgundy">gebaut</em> ist.
                </h2>
                <p className="mt-8 text-lg text-ink/70 max-w-xl leading-relaxed">
                  Aktive Bewerbungsphase ab August 2026 nach Bootcamp-Abschluss · DACH-Region · Vollzeit oder Senior-Freelance.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-ink">
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">
                  Bewerbungs-Zielgruppe
                </p>
                <ul className="space-y-6 text-xl lg:text-2xl text-ink leading-snug">
                  <ContextRow text="Digital- & Marketing-Agenturen mit Hospitality-Vertical" />
                  <ContextRow text="Beratungen für Digitalisierung im Gastgewerbe" />
                  <ContextRow text="Automatisierungs- & Cloud-Berater Hospitality" />
                  <ContextRow text="Hotel-Gruppen mit eigenem Digital-Lead-Bedarf" />
                </ul>
              </div>
              <div className="bg-paper p-10 lg:p-14">
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">
                  Was dieses Projekt belegen soll
                </p>
                <ul className="space-y-6 text-xl lg:text-2xl text-ink leading-snug">
                  <ContextRow text="Senior-Consultant-Methode in Code übersetzbar" />
                  <ContextRow text="Full-Stack · Next.js · Python · Supabase · Multi-Agent-LLM" />
                  <ContextRow text="Tiefes Branchen-Verständnis · 20 Jahre Front-Office bis Direktion" />
                  <ContextRow text="Strategie jenseits von Tool-Adoption — Consultant-Niveau" />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 09 · AUTOR ═══════════════ */}
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
                Fig. 1 · Berlin · MMXXVI
              </p>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <h2 className="h-brutal text-ink" style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}>
                Alex<br />
                <em className="italic-accent text-burgundy">Heyers</em>.
              </h2>
              <p className="mt-6 font-mono text-[11px] tracking-eyebrow uppercase text-ink/60">
                BIZ 26 · KI-Boutique DACH · Vibe-Coder
              </p>
              <div className="mt-10 space-y-6 text-lg text-ink/80 leading-[1.7]">
                <p>
                  Zwanzig Jahre Branchenwege: vom Service über Standort-Leitung bis zur eigenen Digital-Strategie-Boutique. Eltern eines Kleinkinds. Der Wechsel von Hospitality-Praxis zu Hospitality-Tech war keine Karriere-Wendung — er war eine Übersetzung.
                </p>
                <p>
                  Das AI-Adoption-Studio ist das Werkzeug, das ich vor zehn Jahren gebraucht hätte, als ich selbst noch im Hotel-Beruf war und Berater unbezahlbar fand.
                </p>
                <p className="font-mono text-[11px] tracking-eyebrow uppercase text-ink/50">
                  Vibe Coding Bootcamp · Pitch 19.05.2026 · Final-Pitch 21.07.2026
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 10 · CLOSER ═══════════════ */}
        <section className="brutal-bg-dark relative overflow-hidden scroll-reveal spotlight">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-[-6%] parallax-slow">
              <Image
                src="/scene-roadmap-planning.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-55 mix-blend-luminosity"
              />
            </div>
            <div className="absolute inset-0"
                 style={{ background: "linear-gradient(120deg, rgba(10,10,10,0.82), rgba(10,10,10,0.55) 60%, rgba(107,39,55,0.4))" }} />
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
                Bereit für<br />
                <em className="italic-accent text-gold">dreißig Minuten</em><br />
                Klarheit?
              </h2>
              <div className="mt-16 flex flex-wrap items-center gap-8">
                <Link href="/login" className="btn-brutal magnetic-strong" style={{ background: "#FAF6EE", color: "#0A0A0A", borderColor: "#FAF6EE" }}>
                  Live-Demo starten <span>→</span>
                </Link>
                <a href="mailto:a.heyers@gmail.com" className="hover-slide text-paper text-base">
                  a.heyers@gmail.com
                </a>
              </div>
              <p className="mt-24 font-mono text-[10px] tracking-eyebrow uppercase text-paper/50 max-w-xl leading-relaxed">
                Im Gespräch für · Festanstellung in Digital-Agentur mit Hospitality-Vertical · Senior-Freelance · Beratungs-Anfragen
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

const AGENTS_WITH_IMG = [
  { n: "00", name: "Web-Research",         role: "Vor-Recherche",          img: "/scene-onboarding-upload.jpg" },
  { n: "01", name: "Pre-Audit-Analyst",    role: "Hypothesen",             img: "/scene-director-report.jpg" },
  { n: "02", name: "Document-Analyst",     role: "Daten-Analyse",          img: "/scene-backoffice-paperwork.jpg" },
  { n: "03", name: "Process-Auditor",      role: "15 Hotel-Domains",       img: "/scene-reception-overload.jpg" },
  { n: "04", name: "Use-Case-Generator",   role: "VUFVE-Filter",           img: "/scene-roadmap-planning.jpg" },
  { n: "05", name: "Tool-Recommender",     role: "Stack + TSE-Check",      img: "/scene-onboarding-upload.jpg" },
  { n: "06", name: "ROI-Calculator",       role: "Cashflow · Payback",     img: "/scene-director-report.jpg" },
  { n: "07", name: "Compliance-Checker",   role: "DSGVO · AI-Act",         img: "/scene-backoffice-paperwork.jpg" },
  { n: "08", name: "Roadmap-Generator",    role: "3 Phasen",               img: "/scene-roadmap-planning.jpg" },
  { n: "09", name: "Reporter",             role: "Executive Summary",      img: "/scene-voice-interview.jpg" },
];

/* ── COMPONENTS ────────────────────────────────────── */

function BrutalProblem({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border-t-2 border-paper/30 pt-6">
      <p className="font-display italic text-burgundy text-3xl"
         style={{ fontVariationSettings: '"WONK" 1' }}>
        {n}
      </p>
      <p className="mt-4 h-brutal-sm text-paper">{title}</p>
      <p className="mt-4 text-paper/70 leading-relaxed">{body}</p>
    </li>
  );
}

function BrutalKPI({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="bg-paper p-8 lg:p-12 group hover:bg-paper2 transition-colors duration-500 spotlight">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">{label}</p>
      <p className={`mt-8 counter-massive ${accent ? "text-burgundy" : "text-ink"}`}>
        {value}
      </p>
      <p className="mt-6 font-mono text-[10px] tracking-eyebrow uppercase text-ink/60">{unit}</p>
    </div>
  );
}

/* Pain-Card · Branchen-Realität · qualitativ statt mit Zahlen */
function PainCard({ eyebrow, title, body, accent }: { eyebrow: string; title: string; body: string; accent?: boolean }) {
  return (
    <div className="bg-paper p-8 lg:p-10 group hover:bg-paper2 transition-colors duration-500 spotlight flex flex-col">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
        · {eyebrow}
      </p>
      <p className={`mt-8 font-display text-3xl lg:text-4xl leading-[1.0] ${accent ? "text-burgundy" : "text-ink"}`}
         style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1, "opsz" 144' }}>
        <em>{title}</em>
      </p>
      <p className="mt-6 text-ink/70 leading-relaxed text-sm flex-1">
        {body}
      </p>
    </div>
  );
}

/* Customer-Journey-Track · 5 Phasen-Karten verbunden durch Linie */
type Step = { n: string; eyebrow: string; title: string; body: string };
function JourneyTrack({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      {/* horizontale Verbindungslinie (Desktop) */}
      <div className="hidden lg:block absolute left-0 right-0 top-[88px] h-px bg-ink/20" />
      {/* vertikale Verbindungslinie (Mobile) */}
      <div className="lg:hidden absolute left-7 top-12 bottom-12 w-px bg-ink/20" />

      <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
        {steps.map((s, idx) => (
          <li key={s.n} className="relative scroll-reveal">
            {/* Number-Kreis am Track */}
            <div className="flex lg:block items-center gap-4 mb-6 lg:mb-12">
              <span className="relative z-10 flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-burgundy text-paper font-mono text-sm lg:text-base font-medium tracking-wide shrink-0 shadow-[0_8px_24px_-8px_rgba(107,39,55,0.5)] transition-transform duration-500 group-hover:scale-110"
                    style={{ animationDelay: `${idx * 100}ms` }}>
                {s.n}
              </span>
              <span className="lg:hidden font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">
                · {s.eyebrow}
              </span>
            </div>

            {/* Karten-Inhalt */}
            <div className="lg:pl-0 lg:pr-4">
              <p className="hidden lg:block font-mono text-[10px] tracking-eyebrow uppercase text-burgundy mb-3">
                · {s.eyebrow}
              </p>
              <p className="font-display text-2xl lg:text-3xl xl:text-4xl text-ink leading-[1.05] mb-4"
                 style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1, "opsz" 144' }}>
                <em>{s.title}</em>
              </p>
              <p className="text-ink/70 leading-relaxed text-sm lg:text-base">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BrutalRow({ n, label, detail }: { n: string; label: string; detail: string }) {
  return (
    <li className="grid grid-cols-12 gap-4 items-baseline border-t border-ink/15 pt-5">
      <span className="col-span-3 brutal-rank text-burgundy" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
        {n}
      </span>
      <div className="col-span-9">
        <p className="font-display text-lg text-ink leading-tight">{label}</p>
        <p className="text-xs text-ink/60 mt-1">{detail}</p>
      </div>
    </li>
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

/* GWA-Hero-Adjektiv · italic + thin underline · gestaffelter Rise */
function HeroAdj({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block hero-rise" style={{ animationDelay: `${delay}ms`, color: "#FAF6EE" }}>
      <span className="relative inline-block pr-[0.15em]">
        {children}
        <span className="absolute left-0 right-[0.4em] bottom-[0.14em] hero-underline"
              style={{
                height: "0.025em",
                background: "#FAF6EE",
                animationDelay: `${delay + 500}ms`,
              }} />
      </span>
    </span>
  );
}
