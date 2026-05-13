"""
Generiert Hero-Bilder für die Landing-Page.
Fokus: WAS die App macht und WO sie im Hotel hilft — realistische Szenen,
echte Personen, dokumentarisch fotografiert.
Modell: gpt-image-2 · quality high · size 1536x1024
"""
from __future__ import annotations
import base64
import os
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
OUT_DIR = ROOT / "web" / "public"
OUT_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ["OPENAI_API_KEY"]

# Gemeinsamer Stil-Anker für ALLE Szenen — sorgt für visuelle Kohärenz
STYLE = (
    "Editorial documentary photography, shot on a 50mm lens, natural window light, "
    "muted earth-tone palette of warm cream, deep burgundy, brushed brass, ink-black and oak-wood, "
    "high-end hospitality magazine quality, Monocle-magazine aesthetic, subtle film grain, "
    "shallow depth of field, candid moment not posed, real human expression with weight and presence, "
    "ultra-realistic skin texture, soft golden-hour ambient light, no stock-photo cliches, "
    "no oversaturation, no AI artifacts, no extra fingers, no warped text on signs."
)

SCENES: dict[str, str] = {
    # ── 01 · DAS PROBLEM: überlastete Rezeption ───────────────────
    "scene-reception-overload": (
        "A young female front-office hotel receptionist in her late twenties wearing a clean burgundy "
        "blazer over a cream blouse, standing behind a wooden boutique-hotel reception desk in a "
        "European hotel lobby (think Lake Garda or Tyrol). She is mid-conversation on a sleek black "
        "desk phone pressed to her ear, while her other hand hovers over a desktop computer keyboard. "
        "Beside her on the polished oak desk: stacks of printed reservation emails, a brass call bell, "
        "a leather guestbook, a half-finished espresso. A guest with a suitcase waits patiently at the "
        "edge of the frame, slightly out of focus. The composition shows the moment a busy hotel "
        "professional gets overloaded by tasks that an AI system could absorb. "
        f"{STYLE}"
    ),
    # ── 02 · DIE LÖSUNG: Hotel-Direktor empfängt den Analyse-Report ──
    "scene-director-report": (
        "A confident male hotel director in his early fifties, salt-and-pepper hair, wearing a "
        "well-tailored charcoal blazer with no tie over a crisp white shirt, sitting at a heavy "
        "oak desk in a quiet boutique-hotel back office. He is leaning forward, reading a printed "
        "executive-summary report in a leather portfolio, a slim silver MacBook open beside him "
        "showing a dashboard with charts (KPIs, ROI bars) — render the chart shapes elegantly, "
        "do NOT render readable text on the screen. Through the tall window behind him: a soft-focused "
        "vineyard or alpine view at late afternoon. A vintage brass desk lamp, a small espresso cup, "
        "and a fountain pen on the table. The moment captures a senior hospitality leader receiving "
        "clarity from a strategic analysis — focused, decisive, calm. "
        f"{STYLE}"
    ),
    # ── 03 · DAS HERZSTÜCK: das Voice-Interview-Gespräch ─────────────
    "scene-voice-interview": (
        "Close-up over-the-shoulder shot of a forty-something female hotel general manager, dark hair "
        "in a low knot, wearing an elegant cream knit sweater, sitting at a window-side table in a "
        "boutique hotel breakfast room. She holds a modern white smartphone to her ear in her right "
        "hand, speaking thoughtfully, gesturing slightly with her left hand. On the marble table in "
        "front of her: a notebook open with handwritten notes, a fountain pen, a small white "
        "espresso cup with golden rim, and a slim laptop showing a clean minimalist voice-call UI "
        "(abstract wave-form bars in burgundy, no readable text). Soft morning light from the large "
        "window. The body language conveys engaged conversation — this is a senior consultant call. "
        f"{STYLE}"
    ),
    # ── 04 · DIE REALITÄT: Backoffice mit Papier-Belegen ─────────────
    "scene-backoffice-paperwork": (
        "Wide eye-level shot of a middle-aged male hotel accountant in his late forties, wearing a "
        "muted olive cardigan over a dress shirt, sitting at a slightly cluttered desk in a small "
        "European hotel back-office. The desk holds tall stacks of paper invoices in vintage manila "
        "folders, a beige adding-machine printout spilling onto the floor, a thick three-ring binder "
        "labeled with anonymous black labels (no readable text), a half-cold cup of coffee, a "
        "calculator. He looks at one invoice with a tired but kind expression — the document is "
        "deliberately blurry, no text readable. Warm tungsten desk lamp light. Wood-panelled walls "
        "with a framed black-and-white historic hotel photograph. The shot captures the analog "
        "burden in hospitality back-offices — exactly the pain that automation removes. "
        f"{STYLE}"
    ),
    # ── 05 · DER ANFANG: Onboarding-Moment beim Tablet-Upload ────────
    "scene-onboarding-upload": (
        "Top-down flat-lay shot of two pairs of hands meeting over a slim natural-oak conference "
        "table in a quiet hotel meeting room. Hand 1 (woman in her thirties, simple gold ring, no "
        "polish) gently slides a stack of printed hotel reports across the table. Hand 2 (man in his "
        "forties, neat sleeve of a navy blazer) holds an iPad-style tablet showing a clean upload "
        "interface — minimal UI with progress bars in burgundy and cream, no readable text. Between "
        "them on the table: a small brass key-tag from the hotel, a white porcelain water carafe, "
        "two thin pencils, a leather notebook. The shot is documentary, not staged. Captures the "
        "moment a hotel hands its data over for analysis. "
        f"{STYLE}"
    ),
    # ── 06 · DAS ERGEBNIS: die Roadmap an der Wand ──────────────────
    "scene-roadmap-planning": (
        "Eye-level shot looking past two hotel executives — a woman in her late thirties in a slate "
        "wool blazer (foreground, slightly out of focus from behind) and a man in his fifties in a "
        "burgundy cardigan (mid-frame, three-quarter view) — both facing a large cream-colored wall "
        "in a hotel back office. The wall is covered with rectangular sticky notes arranged in three "
        "vertical columns (suggesting three phases of a roadmap). Notes are in muted tones: cream, "
        "burgundy, gold, ink — no readable text on any note. A few hand-drawn arrows connect notes. "
        "Below the wall: a long wooden console with two espresso cups, a brass desk lamp, an open "
        "leather notebook. Soft afternoon window light spills in from the left. The image conveys "
        "strategic clarity after analysis — calm, deliberate, hospitality-grade. "
        f"{STYLE}"
    ),
}

def generate(name: str, prompt: str, *, retries: int = 2) -> Path:
    out_path = OUT_DIR / f"{name}.jpg"
    print(f"[{name}] → starting generation")
    payload = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": "1536x1024",
        "quality": "high",
        "n": 1,
    }
    for attempt in range(1, retries + 2):
        try:
            with httpx.Client(timeout=300.0) as client:
                resp = client.post(
                    "https://api.openai.com/v1/images/generations",
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
            if resp.status_code != 200:
                print(f"[{name}] HTTP {resp.status_code}: {resp.text[:300]}")
                if attempt <= retries:
                    time.sleep(8 * attempt)
                    continue
                raise RuntimeError(f"non-200 after retries: {resp.status_code}")
            data = resp.json()
            b64 = data["data"][0]["b64_json"]
            out_path.write_bytes(base64.b64decode(b64))
            size_kb = out_path.stat().st_size // 1024
            print(f"[{name}] OK ({size_kb} KB) → {out_path.name}")
            return out_path
        except Exception as exc:
            print(f"[{name}] attempt {attempt} failed: {exc}")
            if attempt <= retries:
                time.sleep(8 * attempt)
                continue
            raise
    raise RuntimeError(f"unreachable for {name}")


def main() -> int:
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    targets = [(n, p) for n, p in SCENES.items() if not only or n in only]
    print(f"Generating {len(targets)} scenes → {OUT_DIR}")
    failed: list[str] = []
    for name, prompt in targets:
        try:
            generate(name, prompt)
        except Exception as exc:
            print(f"[{name}] FAILED: {exc}")
            failed.append(name)
        time.sleep(2)
    print(f"\nDone. {len(targets) - len(failed)}/{len(targets)} succeeded.")
    if failed:
        print(f"Failed: {', '.join(failed)}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
