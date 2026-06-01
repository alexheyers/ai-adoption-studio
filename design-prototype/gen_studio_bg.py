"""
gpt-image-2 · Cinematic Backdrops für AI-Adoption-Studio Masterpiece.
Dunkel, atmosphärisch, brand-graded — sitzen HINTER dem Partikelsystem.
Output: studio-assets/*.jpg  ·  Log: gen_studio_bg.log
"""
import os, base64, requests, sys
from pathlib import Path
from datetime import datetime

OUT = Path("studio-assets"); OUT.mkdir(exist_ok=True)
LOG = Path("gen_studio_bg.log")

def log(m):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {m}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

# API key
key = os.environ.get("OPENAI_API_KEY", "")
if not key:
    for p in [Path(".env"), Path("_Content-Pipeline/.env"), Path("ai-adoption-studio/.env")]:
        if p.exists():
            for line in p.read_text().splitlines():
                if line.startswith("OPENAI_API_KEY="):
                    key = line.split("=", 1)[1].strip(); break
        if key: break
if not key:
    log("ERROR: no OPENAI_API_KEY"); sys.exit(1)
log(f"key ok ({len(key)} chars)")

IMAGES = {
    "studio-bg-hero.jpg": {
        "quality": "high",
        "prompt": (
            "Cinematic ultra-dark editorial photograph, deep navy-blue near-black background. "
            "An elegant empty luxury hotel lobby at night seen through atmospheric haze, "
            "soft teal and warm amber practical lights as distant out-of-focus bokeh, "
            "volumetric light rays, gentle fog. The right side dissolves into floating "
            "abstract specks of light. Sophisticated, moody, enormous amount of dark negative space, "
            "subject sits in the lower third. Color graded to deep navy, teal and a hint of magenta. "
            "Shot on cinema camera, shallow depth of field, fine film grain. "
            "No people, no text, no logos, no watermark."
        ),
    },
    "studio-bg-data.jpg": {
        "quality": "medium",
        "prompt": (
            "Cinematic ultra-dark abstract background, deep navy near-black, mostly black negative space. "
            "Long-exposure threads and streaks of light flowing left to right, like scattered data "
            "resolving into structure; teal and magenta light trails over darkness, a faint grid of "
            "glowing dots emerging from chaos into order on one side. Volumetric, atmospheric, elegant. "
            "Color graded navy / teal / magenta. Fine film grain. No text, no logos, no watermark."
        ),
    },
    "studio-bg-craft.jpg": {
        "quality": "medium",
        "prompt": (
            "Cinematic ultra-dark moody photograph, deep navy shadows, film-noir lighting. "
            "Extreme close-up of a hospitality craft moment: a hand resting on a polished dark bar counter, "
            "a single glass catching a sliver of warm amber rim light, most of the frame falling into "
            "deep navy darkness. Intimate, human, editorial, lots of shadow and negative space. "
            "Color graded deep navy with one warm amber accent. Shallow depth of field, fine film grain. "
            "No faces, no text, no logos, no watermark."
        ),
    },
}

URL = "https://api.openai.com/v1/images/generations"
HEAD = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

for fname, cfg in IMAGES.items():
    log(f"→ {fname} (quality={cfg['quality']}) …")
    try:
        r = requests.post(URL, headers=HEAD, timeout=300, json={
            "model": "gpt-image-2",
            "prompt": cfg["prompt"],
            "size": "1536x1024",
            "quality": cfg["quality"],
            "n": 1,
        })
        if r.status_code != 200:
            log(f"  ! HTTP {r.status_code}: {r.text[:200]}"); continue
        b64 = r.json()["data"][0]["b64_json"]
        (OUT / fname).write_bytes(base64.b64decode(b64))
        log(f"  ✓ saved {fname} ({(OUT/fname).stat().st_size//1024} KB)")
    except Exception as e:
        log(f"  ! {fname} failed: {e}")

log("DONE")
