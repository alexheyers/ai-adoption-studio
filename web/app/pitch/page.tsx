import Link from "next/link";
import { EditorialHeader } from "@/components/Layout";

/**
 * Pitch · Director's Cut (26.05.2026) — zeitlose Konzept-Doku statt Investor-Deck.
 * Kein Markt-Sizing/Moats, keine n8n-"live"-Behauptung. Agenten als Library auf dem
 * Claude Agent SDK (im Aufbau). FastAPI/Code ehrlich. Keine erfundenen Zahlen.
 */

export default function PitchPage() {
  return (
    <div className="bg-paper">
      <EditorialHeader />

      {/* 01 · COVER */}
      <Slide bg="brutal-bg-dark" className="text-paper">
        <div className="grid grid-cols-12 gap-x-6 w-full">
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-10">
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-eyebrow uppercase text-paper/60">
              <span>Vol. I · No. 01</span>
              <span className="hidden md:inline">Konzept-Doku</span>
              <span>Vibe Coding Bootcamp 2026</span>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">Mein Projekt, in einem Dokument</p>
              <h1 className="font-display" style={{ fontSize: "clamp(3rem,8vw,7rem)", lineHeight: 0.92 }}>
                AI-Adoption
                <br />
                <span className="italic text-gold">Studio.</span>
              </h1>
              <p className="mt-10 text-2xl text-paper/80 max-w-2xl leading-snug">
                Ein Werkzeug, das einem Haus zuhört — und aus dem Gespräch eine strukturierte Datenbasis
                macht, mit der man sofort weiterarbeiten kann. Gebaut, nicht versprochen.
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6 pt-10 border-t border-paper/20 font-mono text-[10px] tracking-eyebrow uppercase text-paper/60">
              <div>
                <p className="text-paper">Alex Heyers</p>
                <p>Mosbach · DACH</p>
              </div>
              <div className="text-right">
                <p>20 Jahre · Gastronomie → Digital → KI</p>
                <p>live dokumentiert</p>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* 02 · WARUM */}
      <Slide>
        <Eyebrow num="01" label="Warum" />
        <H>
          Zwanzig Jahre habe ich auf dieses Werkzeug <em className="italic-accent text-burgundy">gewartet</em>.
        </H>
        <div className="mt-12 grid md:grid-cols-2 gap-12 text-lg text-ink2 leading-relaxed max-w-4xl">
          <p>
            Service, Bar, Standort, Direktion. In all den Jahren kam ein Berater nach dem anderen — dicke
            Foliensätze, große Worte, und am Ende blieb das Wesentliche unberührt: das, was am Samstag um
            neun wirklich passiert.
          </p>
          <p>
            Also baue ich es selbst. Kein Werkzeug, das jemanden ersetzt — eines, das zuhört, mitschreibt
            und Routine abnimmt. Damit wieder Zeit für das bleibt, weswegen man in diese Branche geht:
            Gäste, Menschen.
          </p>
        </div>
      </Slide>

      {/* 03 · DIE IDEE */}
      <Slide bg="bg-paper2">
        <Eyebrow num="02" label="Die Idee" />
        <H>
          Reden — und nebenbei entsteht <em className="italic-accent text-burgundy">Struktur</em>.
        </H>
        <p className="mt-10 max-w-3xl text-xl text-ink2 leading-snug">
          Kein Formular-Marathon, kein Workshop über Wochen. Man lädt seine Daten hoch, redet ein Mal in
          Ruhe über sein Haus — und am Ende liegt eine saubere, strukturierte Erfassung vor, mit der man
          wirklich arbeiten kann. KI ist hier kein Selbstzweck. Sie macht den Prozess nur sinnvoll: aus
          Bauchgefühl wird Datenbasis.
        </p>
        <div className="mt-14 grid md:grid-cols-3 gap-px bg-ink/15 border-y border-ink/15">
          <StatCell value="1×" unit="Gespräch" label="statt mehreren Berater-Workshops" />
          <StatCell value="0" unit="Formulare" label="die Daten entstehen im Reden" accent />
          <StatCell value="→" unit="Sofort verwertbar" label="strukturiert, weiterverarbeitbar" />
        </div>
      </Slide>

      {/* 04 · SO LÄUFT'S */}
      <Slide>
        <Eyebrow num="03" label="So läuft's" />
        <H>Fünf Schritte vom Upload zur Empfehlung.</H>
        <ol className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-px bg-ink/15 border-y border-ink/15">
          {[
            ["01", "Daten hochladen", "GuV · Reports · Prozesse"],
            ["02", "Agent liest", "strukturierte Übersicht"],
            ["03", "Gespräch", "freundlich, nachfragend"],
            ["04", "Struktur", "verwertbare Datenbasis"],
            ["05", "Empfehlung", "realistisch, umsetzbar"],
          ].map(([n, t, d]) => (
            <li key={n} className="bg-paper p-6">
              <p className="font-mono text-burgundy text-[10px] tracking-eyebrow">{n}</p>
              <p className="font-display text-xl text-ink mt-2">{t}</p>
              <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-3">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-lg text-ink2 max-w-3xl leading-relaxed">
          Das Gespräch führt ein Voice-Agent — freundlich, in Ruhe, mit echten Rückfragen. Er kennt die
          hochgeladene Analyse schon und geht dann konkret rein: Wie groß ist die Infrastruktur? Welche
          Tools laufen? Wo drückt&apos;s gerade? Daraus werden Vorschläge, die ein normales Haus auch
          wirklich stemmen kann.
        </p>
      </Slide>

      {/* 05 · DIE AGENTEN */}
      <Slide bg="bg-paper2">
        <Eyebrow num="04" label="Die Agenten" />
        <H>
          Spezialisten im Mini-Format — als <em className="italic-accent text-burgundy">Library</em>.
        </H>
        <p className="mt-8 max-w-3xl text-lg text-ink2 leading-relaxed">
          Kein Alleskönner-Prompt, sondern mehrere Agenten mit je klarem Job. Aufgebaut als wiederverwendbare
          Agenten-Library auf dem <em className="italic-accent text-burgundy">Claude Agent SDK</em>{" "}
          <span className="text-ink3">(im Aufbau)</span> — echter Code, kein zusammengeklickter Ablauf. Jeder
          Schritt liefert ein prüfbares Zwischenergebnis.
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-5">
          {[
            ["Web-Research", "Recherchiert das Haus + Region vorab, damit das Gespräch mit Kontext startet."],
            ["Dokumenten-Analyst", "Liest PDF/Excel/CSV und macht daraus eine strukturierte Kennzahlen-Übersicht."],
            ["Prozess-Auditor", "Findet die zeitfressenden Abläufe und schätzt das Automatisierungs-Potenzial."],
            ["Use-Case-Generator", "Übersetzt Engpässe in konkrete Anwendungsfälle, markiert schnelle Erfolge."],
            ["Tool-Empfehlung", "Schlägt passende Werkzeuge vor — mit Alternativen, Kosten, DSGVO-Blick."],
            ["Wirtschaftlichkeit", "Rechnet Aufwand, Nutzen und Amortisation — nachvollziehbar, nicht geschönt."],
            ["Compliance-Check", "DSGVO, EU-AI-Act, Branchen-Recht — strukturierte Hinweise, keine Rechtsberatung."],
            ["Reporter", "Bündelt alles zu einer lesbaren Zusammenfassung — konkret, ohne Buzzwords."],
          ].map(([name, desc]) => (
            <div key={name} className="border-l-2 border-burgundy pl-5 py-2">
              <p className="font-display text-xl text-ink leading-tight">{name}</p>
              <p className="text-sm text-ink2 mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
          Detail + Architektur-Diagramm →{" "}
          <Link href="/agents" className="text-burgundy hover-slide">Agents-Seite</Link>
        </p>
      </Slide>

      {/* 06 · STAND */}
      <Slide>
        <Eyebrow num="05" label="Wo ich heute stehe" />
        <H>Ehrlich, was läuft — und was noch nicht.</H>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-12">
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-sage mb-4">✓ läuft (auf dem Server)</p>
            <ul className="space-y-3 text-ink2">
              {[
                "Frontend + Backend sind live deployed",
                "Dokumenten-Analyse (PDF/Excel/CSV → Struktur)",
                "Web-Research, Prozess-Auditor im Betrieb",
                "Datenbank + Upload-Pipeline stehen",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-burgundy">✓</span> {t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-gold mb-4">◐ im Bau / geplant</p>
            <ul className="space-y-3 text-ink2">
              {[
                "Voice-Agent: Gespräch geprimt mit Analyse, freundlicher Ton",
                "Umbau der Agenten auf das Claude Agent SDK (Library)",
                "Empfehlungs- und Roadmap-Teil",
                "Projekt-Implementierung als nächste Phase",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-gold">◐</span> {t}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 font-mono text-[11px] tracking-eyebrow uppercase text-ink3 max-w-3xl">
          Kein Hochglanz-Status. Was deployed ist, ist deployed; was im Bau ist, heißt im Bau.
        </p>
      </Slide>

      {/* 07 · ÜBERTRAGBAR */}
      <Slide bg="brutal-bg-dark" className="text-paper">
        <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">06 · Übertragbar</p>
        <H light>
          Hospitality ist mein Beispiel — <em className="italic-accent text-gold">nicht</em> meine Grenze.
        </H>
        <p className="mt-10 max-w-3xl text-xl text-paper/80 leading-snug">
          Ich baue für Hotels, weil ich diese Welt zwanzig Jahre gelebt habe — da bin ich glaubwürdig. Aber
          die Mechanik dahinter ist branchen-blind: anderes Wissen eingepflegt, andere Daten rein — und
          dieselbe Library arbeitet für eine andere Branche. Das ist der eigentliche Wert dessen, was ich
          hier zeige.
        </p>
      </Slide>

      {/* 08 · STACK */}
      <Slide>
        <Eyebrow num="07" label="Stack" />
        <H>Womit&apos;s gebaut ist.</H>
        <div className="mt-12 grid md:grid-cols-3 gap-px bg-ink/15 border-y border-ink/15">
          <TechCard title="Frontend" items={["Next.js", "Editorial-Design-System", "Voice-Anbindung"]} />
          <TechCard title="Backend" items={["Python", "Multi-Agent · Claude Agent SDK (im Aufbau)", "Anthropic + ElevenLabs"]} />
          <TechCard title="Daten" items={["Datenbank + Storage", "Dokumenten-Parser", "Deliverables (PDF/Excel)"]} />
        </div>
      </Slide>

      {/* 09 · WO ICH HINWILL */}
      <Slide bg="bg-paper2">
        <Eyebrow num="08" label="Wo ich hinwill" />
        <H>
          Von der Empfehlung zur <em className="italic-accent text-burgundy">Umsetzung</em>.
        </H>
        <p className="mt-10 max-w-3xl text-xl text-ink2 leading-snug">
          Wenn Voice-Agent und Analyse rund laufen, ist der nächste Schritt klar: nicht bei der Empfehlung
          stehenbleiben, sondern die Umsetzung mit begleiten. Aus &bdquo;das solltet ihr tun&ldquo; wird
          &bdquo;so setzen wir&apos;s Schritt für Schritt um&ldquo;. Das ist die Richtung, in die ich in den
          nächsten Wochen weiterbaue.
        </p>
      </Slide>

      {/* 10 · REDEN WIR */}
      <Slide bg="brutal-bg-dark" className="text-paper">
        <p className="font-mono text-[11px] tracking-eyebrow uppercase text-gold mb-6">09 · Reden wir</p>
        <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: 0.95 }}>
          Fragen? <em className="text-gold italic">Schreib mir.</em>
        </h2>
        <a
          href="mailto:a.heyers@gmail.com"
          className="mt-12 inline-block font-display italic text-paper hover-slide"
          style={{ fontSize: "clamp(2rem,5vw,4rem)" }}
        >
          a.heyers@gmail.com
        </a>
        <p className="mt-6 font-mono text-[11px] tracking-eyebrow uppercase text-paper/50">
          Alex Heyers · Mosbach · Vibe Coding Bootcamp 2026
        </p>
      </Slide>

      <div className="bg-paper2 border-t border-ink/15">
        <div className="mx-auto max-w-[1280px] px-8 py-6 flex items-center justify-between font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
          <span>AI-Adoption-Studio · Konzept-Doku</span>
          <Link href="/" className="hover:text-burgundy">← zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Slide({ children, bg = "bg-paper", className = "" }: { children: React.ReactNode; bg?: string; className?: string }) {
  return (
    <section className={`${bg} ${className} min-h-screen flex items-center`}>
      <div className="mx-auto max-w-[1280px] w-full px-8 py-20 lg:py-24">{children}</div>
    </section>
  );
}

function Eyebrow({ num, label }: { num: string; label: string }) {
  return <p className="font-mono text-[11px] tracking-eyebrow uppercase text-burgundy mb-6">{num} · {label}</p>;
}

function H({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className={`font-display ${light ? "text-paper" : "text-ink"}`}
      style={{ fontSize: "clamp(2.2rem,5vw,4.5rem)", lineHeight: 1.0, letterSpacing: "-0.025em", fontWeight: 500 }}
    >
      {children}
    </h2>
  );
}

function StatCell({ value, unit, label, accent = false }: { value: string; unit: string; label: string; accent?: boolean }) {
  return (
    <article className="bg-paper2 p-10 flex flex-col">
      <p className={`font-display text-6xl leading-none ${accent ? "text-burgundy" : "text-ink"}`}>{value}</p>
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3 mt-3">{unit}</p>
      <p className="mt-5 text-ink2 text-sm leading-snug">{label}</p>
    </article>
  );
}

function TechCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="bg-paper p-10">
      <p className="font-mono text-[10px] tracking-eyebrow uppercase text-burgundy">{title}</p>
      <ul className="mt-6 space-y-3 text-base text-ink2">
        {items.map((i) => (
          <li key={i}>· {i}</li>
        ))}
      </ul>
    </article>
  );
}
