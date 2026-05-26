"""example_run.py — kleines lauffähiges Beispiel für das ai_adoption-Pattern.

Lädt eine Demo-Briefing (mock_data/demo_hotel.json), baut den Pipeline-Kontext
und lässt den config-getriebenen Orchestrator die migrierten SDK-Agenten laufen.

NUR DEMO-DATEN — keine echten Kundendaten.

Ausführung (aus dem Repo-Root):
    .venv/bin/python -m agent_patterns.example_run

Voraussetzungen:
    - claude-agent-sdk installiert  (.venv/bin/pip install -r agent_patterns/requirements.txt)
    - ANTHROPIC_API_KEY in .env / Umgebung
    - Claude Code CLI verfügbar ODER API-Key (siehe docs/sdk-architecture.md)

Ohne SDK/Key bricht der Lauf mit einem klaren Hinweis ab (kein Crash beim Import).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Repo-Root in den Pfad, damit `schemas`, `knowledge` etc. importierbar sind,
# egal von wo das Script gestartet wird.
REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from schemas.briefing import Briefing  # noqa: E402

from agent_patterns.config import DEFAULT_CONFIG_PATH  # noqa: E402
from agent_patterns.core.orchestrator import Orchestrator, PatternConfig  # noqa: E402
from agent_patterns.patterns.ai_adoption import REGISTRY  # noqa: E402

DEMO_BRIEFING_PATH = REPO_ROOT / "mock_data" / "demo_hotel.json"


def load_demo_context() -> dict:
    """Baut den Pipeline-Kontext aus der Demo-Briefing."""
    data = json.loads(DEMO_BRIEFING_PATH.read_text(encoding="utf-8"))

    # Briefing-Objekt für den Process-Auditor.
    briefing = Briefing.model_validate(
        {
            "company": data["company"],
            "kpis": data.get("kpis", {}),
            "pain_points": data.get("pain_points", []),
            "current_tools": data.get("current_tools", []),
            "documents_summary": data.get("documents_summary", ""),
            "voice_interview_transcript": data.get("voice_interview_transcript"),
            "notes": data.get("notes"),
        }
    )

    # Minimaler Demo-Dokument-Satz für den Document-Analyst.
    demo_documents = [
        {
            "filename": "GuV_2024.xlsx",
            "doc_type": "gv_report",
            "parsed_text": data.get("documents_summary", ""),
            "extracted_kpis": data.get("kpis", {}),
        }
    ]

    return {
        "briefing": briefing,
        "company": {
            **data["company"],
            "annual_revenue_eur": data["company"].get("annual_revenue_eur"),
        },
        "documents": demo_documents,
        "voice_transcript": data.get("voice_interview_transcript"),
    }


def main() -> int:
    print(f"Demo-Briefing: {DEMO_BRIEFING_PATH.name}")
    context = load_demo_context()

    config = PatternConfig.from_yaml(DEFAULT_CONFIG_PATH)
    orchestrator = Orchestrator(registry=REGISTRY, config=config)

    try:
        results = orchestrator.run_sync(context, verbose=True)
    except ImportError as exc:
        print("\n[Setup nötig]")
        print(exc)
        return 2

    print("\n--- Ergebnis-Übersicht ---")
    for name, result in results.items():
        out = result.output
        if name == "process_auditor":
            print(f"{name}: {len(out.processes)} Prozesse, Summary: {out.summary[:90]}…")
        elif name == "document_analyst":
            print(
                f"{name}: {len(out.insights)} Insights, "
                f"Daten-Qualität {out.data_quality_score}"
            )
        else:
            print(f"{name}: {type(out).__name__}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
