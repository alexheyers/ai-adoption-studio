/**
 * what-is-it.ts — kanonische Antwort auf „Was liegt auf myflowmotion.cloud?"
 *
 * Voice: Alex-Editorial. Em-Dash-Rhythmus, Trevor-Setup-Punchline,
 * Gastro-Metaphern, ein Bold pro Block. Keine Marketing-Floskeln.
 */

export const WHAT_IS_IT = {
  eyebrow: "· 00 · Worum es hier geht",
  brand: "AI-Adoption-Studio",
  tagline:
    "Reden statt ausfüllen. Aus einem Gespräch wird eine Datenbasis.",
  intro:
    "Ich baue ein Werkzeug, das einem Haus zuhört. Du lädst ein paar Dokumente hoch, redest 30 Minuten über dein Haus — am Ende liegt eine saubere Datenbasis vor. Kein Workshop-Marathon, kein Folien-Theater. Acht Agenten im Hintergrund, eine Stimme im Vordergrund.",
  tiles: [
    {
      n: "01",
      eyebrow: "Was es ist",
      headline: "Acht Agenten, ein Ablauf",
      body: "FastAPI im Keller. Claude Agent SDK für die Agenten. ElevenLabs für die Stimme. Jeder Agent ein klarer Job — Web-Research, Dokumenten-Analyse, Prozess-Audit, Wirtschaftlichkeit, Compliance. Sequenziell, nicht parallel. Wenn der vorherige sauber abgegeben hat, fängt der nächste an.",
    },
    {
      n: "02",
      eyebrow: "Was du damit machst",
      headline: "Reden, nicht klicken",
      body: "Du lädst GuV und Reports hoch. Der Analyse-Agent liest mit, bevor das Gespräch beginnt. Dann fragt Ada — freundlich, der Reihe nach. Erst Zahlen, dann Infrastruktur, dann wo's wirklich drückt. Du sprichst über dein Haus. Nicht über Felder in einer Maske.",
    },
    {
      n: "03",
      eyebrow: "Was rauskommt",
      headline: "Datenbasis, kein Bauchgefühl",
      body: "Drei Dateien: ein Struktur-Report, eine Excel-Aufstellung, ein PDF. Drin: Prozesse, Engpässe, Tool-Landschaft, plus konkrete Vorschläge mit Aufwand-Nutzen. Was umgesetzt wird, entscheidet ein Mensch. Die KI strukturiert — sie ersetzt keinen Kopf.",
    },
  ],
  targetAudience: {
    eyebrow: "Für wen",
    items: [
      {
        who: "Hoteliers & Direktoren",
        note: "die KI greifbar machen wollen — ohne Berater-Maschinerie",
      },
      {
        who: "Hospitality-Berater",
        note: "die eine ehrliche Erfassungs-Schicht vor ihre eigene Arbeit setzen",
      },
      {
        who: "Hospitality-Tech-Teams",
        note: "Solutions, Implementation, CSM — die ihre Häuser strukturierter verstehen wollen",
      },
    ],
  },
  notForYou: {
    eyebrow: "Wann's nichts für dich ist",
    items: [
      "Du suchst ein fertiges Tool zum Kaufen — das hier ist eine laufende Doku.",
      "Du brauchst eine zertifizierte Berater-Lösung morgen früh — das hier ist ein Lern- und Bewerbungs-Projekt.",
      "Du erwartest eine KI, die alle Probleme löst — sie strukturiert ein Gespräch. Den Kopf bringst du mit.",
    ],
  },
  status: {
    eyebrow: "Status",
    note: "im Bau · 3 von 8 Agenten live · 3 im Aufbau · 2 geplant · Ada läuft als Beta",
  },
} as const;

export type WhatIsIt = typeof WHAT_IS_IT;
