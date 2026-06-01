# 🎨 Design-Fähigkeiten — Was Claude bauen kann

> **Lebende Referenz.** Alles an Effekten, 3D, Animationen und Interaktion, das ich (Claude) dir in eine einzige HTML-Datei bauen kann — ohne Build-Tools, ohne Framework.
> **So nutzt du sie:** Scroll durch, finde was du willst, sag mir z. B. *„bau mir Nr. S9-b als Hero"* oder *„kombinier 33 + 36 + S1"*. Du musst nichts davon können — nur zeigen, was du willst.
>
> **Stand:** 01.06.2026 · **Demo-Dateien** liegen im Projekt-Root (siehe [Datei-Index](#-datei-index) unten).

---

## 📑 Inhalt

1. [Wie du bestellst](#-wie-du-bestellst)
2. [Tier 1 — Einfach](#tier-1--einfach-css-fundamente)
3. [Tier 2 — Fortgeschritten](#tier-2--fortgeschritten-interaktion--tiefe)
4. [Tier 3 — Expert](#tier-3--expert-scroll-choreografie-svg-canvas)
5. [Tier S — Frontier](#tier-s--frontier-gpu-shader-generativ)
6. [Tier Ω — Echtes 3D](#tier-Ω--echtes-3d-threejs--webgl)
7. [Beyond — Was noch geht](#beyond--was-noch-geht)
8. [Die Achsen, die „gut" zu „unvergesslich" machen](#-die-achsen-die-gut-zu-unvergesslich-machen)
9. [Technische Hinweise](#-technische-hinweise-wichtig)
10. [Rezepte / Kombinationen](#-rezepte--fertige-kombinationen)
11. [Datei-Index](#-datei-index)

---

## 🛒 Wie du bestellst

Du musst keine Technik beim Namen kennen. Sag einfach was du willst:
- **Nach Nummer:** „Bau mir Nr. 24 (Bento) mit Nr. 20 (3D-Tilt)."
- **Nach Gefühl:** „Ich will, dass Wörter sich aus Partikeln formen." → ich weiß: S9-b / Showcase-Motor.
- **Nach Zweck:** „Ein Hero für meine Bewerbung, der wow macht." → ich schlage eine Kombi vor.

**Tags in den Tabellen:**
| Tag | Bedeutung |
|-----|-----------|
| `CSS` | Reines CSS, läuft überall, kein JS |
| `JS` | Etwas JavaScript, keine Library |
| `Canvas` | HTML5 Canvas 2D |
| `WebGL` | GPU-Shader, raw WebGL, keine Library |
| `three.js` | Braucht **1 CDN-Zeile** (Internet beim Laden) |
| `🌐 Server` | Braucht lokalen Server (nicht per Doppelklick) — z. B. wenn Bilder ausgelesen werden |
| `🖥 GPU` | Braucht echte Grafikkarte (jeder moderne Rechner) |

---

## Tier 1 — Einfach (CSS-Fundamente)

> Solide Basis. Läuft überall, sofort, ohne alles.

| # | Effekt | Was es macht | Tag |
|---|--------|--------------|-----|
| 01 | **Font-Pairing** | Display-Serif + Sans + Mono kombiniert — der Charakter einer Seite | `CSS` |
| 02 | **Outline / Stroke Text** | Buchstaben als Kontur (`-webkit-text-stroke`) — editorial | `CSS` |
| 03 | **Animated Gradient Text** | Farbverlauf in der Schrift, animiert | `CSS` |
| 04 | **Staggered Load Reveal** | Wörter steigen beim Laden zeitversetzt ein | `CSS` |
| 05 | **Typewriter** | Text wird Zeichen für Zeichen getippt | `JS` |
| 06 | **Letter-Spacing Hover** | Buchstabenabstand öffnet sich beim Hover | `CSS` |
| 07 | **Underline Grow** | Unterstrich wächst von links | `CSS` |
| 08 | **Button: Fill von unten** | Hintergrund füllt sich beim Hover hoch | `CSS` |
| 09 | **Button: Shine Sweep** | Glanzstreifen fährt über den Button | `CSS` |
| 10 | **Button: Border Draw** | Rahmen zeichnet sich beim Hover | `CSS` |
| 11 | **Color Swatches** | Farbpalette als Karten mit Hover-Lift | `CSS` |
| 12 | **Gradient Mesh** | Geblurte, animierte Farbblobs — Atmosphäre | `CSS` |
| 13 | **Grain / Noise Texture** | SVG-Rauschen über Flächen — wirkt teuer/analog | `CSS` |
| 14 | **Dot-Grid Pattern** | Blueprint-Punktraster | `CSS` |
| 15 | **Infinite Marquee** | Endlos-Laufband mit weichen Rändern | `CSS` |

---

## Tier 2 — Fortgeschritten (Interaktion & Tiefe)

> Reagiert auf den Nutzer. Mikro-Interaktionen, die sich lebendig anfühlen.

| # | Effekt | Was es macht | Tag |
|---|--------|--------------|-----|
| 16 | **Glitch Text** | RGB-Split-Störung beim Hover | `CSS` |
| 17 | **Scramble / Decode** | Text entschlüsselt sich aus Rauschen | `JS` |
| 18 | **Magnetic Button** | Button wird vom Cursor angezogen | `JS` |
| 19 | **Ripple Click** | Material-Welle vom Klickpunkt | `JS` |
| 20 | **3D-Tilt Card** | Karte kippt in 3D zum Cursor | `JS` |
| 21 | **Spotlight Card** | Lichtkegel folgt dem Cursor | `JS` |
| 22 | **Flip Card** | 3D-Flip um die Y-Achse | `CSS` |
| 23 | **Glow Border Hover** | Rahmen + Schein erwärmen sich | `CSS` |
| 24 | **Bento Grid** | Asymmetrisches Kachel-Raster | `CSS` |
| 25 | **Clip-Path Reveal** | Fläche wächst kreisförmig heraus | `CSS` |
| 26 | **Conic Aurora** | Rotierender, geblurter Nordlicht-Verlauf | `CSS` |
| 27 | **Rotating Gradient Border** | Umlaufender leuchtender Rahmen | `CSS` |
| 28 | **Reveal on Scroll** | Blöcke faden gestaffelt beim Scrollen ein | `JS` |
| 29 | **Parallax Layers** | Ebenen bewegen sich unterschiedlich schnell | `JS` |
| 30 | **Scroll-Progress-Bar** | Fortschrittsbalken oben | `JS` |
| 31 | **Count-Up Numbers** | Zahlen zählen hoch, wenn sichtbar | `JS` |
| 32 | **Accordion** | Sanft aufklappende Panels | `JS` |

---

## Tier 3 — Expert (Scroll-Choreografie, SVG, Canvas)

> Hier wird gescrollt, gezeichnet, simuliert. Der Sprung zu „das ist aufwendig gemacht".

| # | Effekt | Was es macht | Tag |
|---|--------|--------------|-----|
| 33 | **Sticky Stacking Cards** | Karten kleben, die nächste schiebt sich drüber | `CSS` |
| 34 | **Horizontal Pin Scroll** | Vertikal scrollen = horizontal fahren | `JS` |
| 35 | **Scrollytelling** | Visual pinnt, Schritte laufen durch & steuern es | `JS` |
| 36 | **SVG Line-Draw on Scroll** | Pfad zeichnet sich an der Scroll-Position | `JS` |
| 37 | **Morphing SVG Blob** | Organische Form morpht endlos | `CSS`/SVG |
| 38 | **Particle Constellation** | Canvas-Partikel verbinden sich, reagieren auf Cursor | `Canvas` |
| 39 | **Custom Cursor** | Punkt + nachlaufender Ring statt System-Cursor | `JS` |
| 40 | **Tabs (gleitender Indikator)** | Aktiver Tab mit animiertem Unterstrich | `JS` |
| 41 | **Tooltip** | Sanft ein-/ausgleitender Hinweis | `CSS` |
| 42 | **Live Theme-Swap** | Paletten weich überblenden (CSS-Variablen) | `JS` |
| 43 | **Animated Progress Ring** | SVG-Kreis füllt sich auf einen Prozentwert | `JS` |
| 44 | **Before / After Slider** | Vergleichs-Slider zum Ziehen | `JS` |
| 45 | **Skeleton Loading Shimmer** | „Lädt…"-Platzhalter mit Glanz | `CSS` |

---

## Tier S — Frontier (GPU, Shader, Generativ)

> Hier endet das DOM, hier beginnt die GPU. Ein anderes Medium — Mathematik pro Pixel.

| # | Effekt | Was es macht | Tag |
|---|--------|--------------|-----|
| S1 | **WebGL / GLSL Fragment-Shader** | Flüssige, atmende Farbwelt, pro Pixel auf der GPU, maus-reaktiv | `WebGL` `🖥 GPU` |
| S2 | **SVG Gooey Metaballs** | Formen verschmelzen zähflüssig (Liquid Metal) | `CSS`/SVG |
| S3 | **Generative Flow Field** | Partikel folgen einem Noise-Strömungsfeld, „Creative Coding" | `Canvas` |
| S4 | **Spring-Physik** | Echte Feder-/Trägheitsbewegung statt Easing-Kurven | `JS` |
| S5 | **Native Scroll-Driven CSS** | Scroll-gekoppelte Animation **ganz ohne JS** (`animation-timeline`) | `CSS` |
| S6 | **View Transitions API** | Nahtloser „magic move" zwischen Zuständen/Seiten | `JS` |
| S7 | **Audio-reaktive Visuals** | Web-Audio-FFT treibt die Grafik in Echtzeit | `JS` (Audio-Quelle nötig) |
| S8 | **Variable-Font Kinetik** | Schriftachsen (Gewicht/Neigung) live animiert, pro Buchstabe | `CSS`/`JS` |

---

## Tier Ω — Echtes 3D (three.js / WebGL)

> Begehbare 3D-Welten, Partikel-Massen, prozedurale Räume. Das volle Spektakel.

| # | Effekt | Was es macht | Tag |
|---|--------|--------------|-----|
| S9-a | **three.js Award-Hero** | Glas-/Metall-Objekt mit Refraktion, Reflexion, Bloom, scroll-getriebener Kamera | `three.js` `🖥 GPU` |
| S9-b | **GPGPU Partikel-Morph** | 100.000+ Punkte morphen zwischen Formen, Wörtern, Bildern | `three.js` `🖥 GPU` |
| S9-c | **Raymarching SDF-Welt** | Prozedurale 3D-Welt in **einem** Fragment-Shader, ohne Geometrie | `WebGL` `🖥 GPU` |
| S9-d | **Partikel-Porträt** | Dein Foto zieht sich aus Partikeln zusammen (Pixel → Punktwolke) | `three.js` `🌐 Server` `🖥 GPU` |
| S9-e | **Scroll-Morph-Erzählung** | Partikel morphen szenenweise: Chaos → Wort → Zahl → Gesicht → Ordnung | `three.js` `🌐 Server` `🖥 GPU` |

---

## Beyond — Was noch geht

> Ab hier verschwimmt „Design" mit „Engineering". Alles im Browser, manches mit Webcam/Audio/Extra-Lib.

| Frontier | Was es ist | Tag |
|----------|-----------|-----|
| **Raymarched Fraktale** | Mandelbulb, Volumen-Wolken, unendliche Tunnel — pure Shader-Mathematik | `WebGL` |
| **GPGPU Fluid/Smoke** | Echtzeit-Rauch/Wasser-Simulation auf der GPU | `WebGL`/WebGPU |
| **Liquid Image Transitions** | Bilder zerfließen/displacen ineinander beim Scroll/Hover | `WebGL` |
| **WebXR / AR** | 3D in VR-Brille oder Handy-AR („Modell in deinem Raum") | `three.js` |
| **ML im Browser** | Webcam → Hand-/Pose-/Gesichts-Tracking steuert Visuals | `JS`+Lib, Webcam |
| **Real-time Video-Shader** | Webcam durch GLSL — Hintergrund weg, ASCII-Cam, Style-Transfer | `WebGL`, Webcam |
| **Generative Poster/Identity** | Jeder Besuch erzeugt ein anderes, einzigartiges Design | `Canvas`/`WebGL` |
| **Daten-getriebene Visuals** | Design reagiert auf echte Daten (z. B. dein Bootcamp-Fortschritt) | `JS`+Daten |

---

## 🎯 Die Achsen, die „gut" zu „unvergesslich" machen

> Mehr Effekte machen es **nicht** besser. Ab einem Punkt zählen diese Achsen:

- **💡 Konzept statt Katalog** — *eine* starke Idee, perfekt ausgeführt, schlägt 50 Effekte.
- **🎼 Orchestrierung** — Effekte treffen *einen* Moment gemeinsam, choreografiert (z. B. Shader-Zustand am Scroll = Chaos → Klarheit).
- **📖 Narrativ** — ein echter Bogen: Anfang, Spannung, Auflösung.
- **🔊 Sound Design** — die meistunterschätzte Dimension; dezente Töne addieren gefühlt 50 % Qualität.
- **⏱️ Timing & Physik** — Easing, Stagger, Anticipation, Federn. Der Unterschied gut↔groß.
- **✂️ Restraint** — weglassen. Ein perfekter Moment > zehn gute. Amber max. 1×.
- **⚡ Performance** — 60 fps, sofortiger Load, butterweich = das „teure" Gefühl.

---

## ⚙️ Technische Hinweise (wichtig)

**Abhängigkeiten — was wann gebraucht wird:**
- **Reines CSS / JS / Canvas** → läuft per Doppelklick (`file://`), offline, überall.
- **`three.js`** → braucht **Internet beim Laden** (eine CDN-Zeile, `cdn.jsdelivr.net`). Sonst alles in einer Datei.
- **`🖥 GPU`** (Shader/3D) → braucht echte Grafikkarte = jeder moderne Mac/PC. Im Headless-Screenshot unzuverlässig, im echten Browser voll da.
- **`🌐 Server`** → **wenn Bilder/Videos pixelweise ausgelesen werden** (z. B. dein Gesicht aus Partikeln). `file://` blockt das aus Sicherheitsgründen.
  Lokalen Server starten:
  ```bash
  cd "<Projektordner>" && python3 -m http.server 8765
  # dann öffnen: http://localhost:8765/datei.html
  ```

**Faustregeln für Partikel-Bilder (gelernt am Porträt):**
- **Normal-Blending**, nicht Additive — sonst summieren sich Punkte zu reinem Weiß.
- **Bloom lokal aus**, wo Detail zählt (Gesicht), sonst überstrahlt's.
- **Wenig Jitter** bei Bildern — sonst „bluten" helle Punkte in dunkle Details (Augen, Brille).
- **Dunkler belichten + niedrige Helligkeitsschwelle** = mehr erkennbares Detail.
- **Lesbarkeit von Partikel-Wörtern:** Kamera frontal + still + „dwell" (einrasten) am Ziel, Kamerafahrt nur *zwischen* den Szenen.

---

## 🧩 Rezepte / Fertige Kombinationen

Bewährte Bündel — sag einfach den Namen:

- **„Award-Hero"** = S9-a (Glasobjekt) + 29 (Parallax) + 18 (Magnetic CTA) + Bloom.
- **„Signature Story"** = S9-e (Scroll-Morph-Partikel) + 28 (Reveals) + 31 (Counter) + S8 (Variable-Font) + 39 (Cursor). → *deine `86-tage.html`*.
- **„Showcase-Motor"** = S9-b + S9-d (Partikel morphen durch Wörter → dein Gesicht), frontal lesbar. → *deine `86-tage-showcase.html`*.
- **„Editorial-Landing"** = 02 (Stroke) + 12 (Mesh) + 33 (Sticky-Stack) + 36 (Line-Draw) + 13 (Grain).
- **„Produkt-Seite"** = S9-a (3D-Produkt drehbar) + 24 (Bento) + 44 (Before/After) + 31 (Counter).

---

## 📂 Datei-Index

Alle Demos liegen im Projekt-Root. Öffnen per Doppelklick (außer `🌐`-markierte → über `localhost`):

| Datei | Inhalt | Öffnen |
|-------|--------|--------|
| `design-lab.html` | **Tier 1–3** (Nr. 01–45), beschrifteter Katalog | Doppelklick |
| `design-tier-s.html` | **Tier S** (S1–S8), Frontier-Techniken | Doppelklick (`🖥 GPU`) |
| `design-s9.html` | **Tier Ω** (S9-a/b/c), echtes 3D | Doppelklick (Internet + `🖥 GPU`) |
| `86-tage.html` | **Signature Story** mit Partikel-Hintergrund | Doppelklick (Internet + `🖥 GPU`) |
| `86-tage-showcase.html` | **Showcase-Motor**: Partikel-Morph + dein Gesicht | `🌐 http://localhost:8765/` |
| `86-tage.backup.html` | Frühere Story-Version (flacher Shader) | Doppelklick |

---

## 🚀 Was als Nächstes ginge

- **Sound-Layer** (S7) auf eine bestehende Seite — die fehlende Dimension.
- **Live deployen** (myflowmotion.cloud / Subdomain) → in Bewerbungen/LinkedIn verlinkbar.
- **Echtdaten-Anbindung** — die Seite zeigt deinen realen Fortschritt.
- **Webcam-/AR-Experiment** — falls du mal richtig spielen willst.

> Diese Datei wächst mit. Sag „trag X in die Fähigkeiten-Liste ein", wenn wir was Neues bauen.
