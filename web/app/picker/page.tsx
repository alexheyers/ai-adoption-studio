"use client";

import Image from "next/image";
import Link from "next/link";
import { EditorialHeader } from "@/components/Layout";

/**
 * Interne Auswahl-Seite — Hero-Image-Picker.
 * Zeigt alle 3 gpt-image-2-Varianten parallel im Editorial-Layout.
 * Nicht in der globalen Navigation verlinkt.
 */

const VARIANTS = [
  {
    id: "D",
    name: "Hotel-Reception",
    file: "/hero-D-reception.jpg",
    concept: "Marmor-Reception-Counter mit Brass-Call-Bell, Schlüsselkarten im Holztablett, Pigeon-Hole-Box im Hintergrund + dezenter Laptop mit Belegungs-Dashboard",
    detail: "Hotel · Front-Desk-Prozess · Check-in-Moment",
    tone: "Eindeutig Hotel. Process-Bezug klar (Check-in). KI subtil aber präsent.",
  },
  {
    id: "E",
    name: "Premium-Lobby",
    file: "/hero-E-lobby.jpg",
    concept: "Wide-Shot Hotel-Lobby: hohe Decke, antike Brass-Kronleuchter, Marmor-Säulen, Cream-Linnen-Sessel + Burgundy-Velvet-Sofa, Reception in der Mitte sichtbar",
    detail: "Hotel · Atmospäre · Premium-Hospitality",
    tone: "Das WOW-Bild. Premium-Hotel auf einen Blick. KI nicht im Bild — aber Atmosphäre top.",
  },
  {
    id: "F",
    name: "Concierge-Service",
    file: "/hero-F-concierge.jpg",
    concept: "Concierge-Desk: Brass-Lampe, offenes Reservierungs-Lederbuch, MacBook mit Guest-Management, Vintage-Telefon, Schlüsselrack im Hintergrund",
    detail: "Hotel · Concierge-Prozess · Service-Moment",
    tone: "Konkreter Service-Prozess. Mix aus Tradition (Buch, Phone, Schlüssel) und Tech (Laptop).",
  },
  {
    id: "G",
    name: "Suite-mit-Tablet",
    file: "/hero-G-suite-tablet.jpg",
    concept: "Hotelzimmer-Schreibtisch: Suite-Nummer-Plakette '305', Welcome-Folder, Schokoladentrüffel, Brass-Lampe, Tablet zeigt Hotel-Guest-Dashboard",
    detail: "Hotel · Guest-Experience · In-Room-Service",
    tone: "Suite-Detail mit Tablet. Hotel-Indikatoren stark, Tech-Element prominent.",
  },
];

export default function PickerPage() {
  return (
    <>
      <EditorialHeader />
      <main>
        <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-12">
          <p className="eyebrow">Internal · Hero-Picker</p>
          <h1 className="mt-4 font-display text-display-md text-ink leading-tight max-w-3xl">
            Welches Hero-Bild soll auf der Landing?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink2 leading-relaxed">
            Drei gpt-image-2-Generationen mit unterschiedlichen Kompositionen. Alle Hospitality × KI.
            Sag mir A, B oder C — ich tausche das Hero-Bild auf <Link href="/" className="link-editorial">Landing</Link> sofort aus.
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
            Lädt — Cmd+R falls noch &quot;Bild nicht gefunden&quot;
          </p>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-24 space-y-16">
          {VARIANTS.map((v) => (
            <article key={v.id} className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-ink/15 pt-12">
              <div className="col-span-12 lg:col-span-8">
                <div className="relative aspect-[3/2] overflow-hidden bg-paper2">
                  <Image
                    src={v.file}
                    alt={`Variant ${v.id} · ${v.name}`}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute left-5 top-5 bg-ink text-paper px-3 py-1.5 font-mono text-[10px] tracking-eyebrow uppercase">
                    Variant {v.id}
                  </div>
                </div>
              </div>
              <aside className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l border-ink/15 flex flex-col justify-between gap-6">
                <div>
                  <p className="eyebrow">Variant {v.id}</p>
                  <h2 className="mt-3 font-display text-3xl text-ink leading-tight">{v.name}</h2>
                  <p className="mt-5 text-ink2 leading-relaxed">{v.concept}</p>
                  <p className="mt-4 font-mono text-[10px] tracking-eyebrow uppercase text-ink3 leading-relaxed">
                    {v.detail}
                  </p>
                  <p className="mt-6 text-sm italic text-ink2 leading-relaxed">
                    {v.tone}
                  </p>
                </div>
              </aside>
            </article>
          ))}
        </section>

        <section className="border-t border-ink/15 bg-paper2">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-eyebrow uppercase text-ink3">
              Sag mir: <strong className="text-burgundy">D</strong>, <strong className="text-burgundy">E</strong>, <strong className="text-burgundy">F</strong> oder <strong className="text-burgundy">G</strong> — oder &quot;nochmal&quot; für neue Generationen.
            </p>
            <Link href="/" className="link-editorial font-mono text-[11px] tracking-eyebrow uppercase">
              ← zurück zur Landing
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
