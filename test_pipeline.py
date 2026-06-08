"""End-to-End-Smoke-Test der Multi-Agent-Pipeline mit dem Demo-Hotel.

Dieser Test läuft KOMPLETT OHNE Supabase, ohne Frontend, ohne ElevenLabs.
Er nutzt ein Mock-Briefing und produziert einen FullReport-JSON-Dump.

Setup:
    pip install -r requirements.txt
    cp .env.example .env  # ANTHROPIC_API_KEY eintragen

Run (Standard, ohne Web-Research):
    python test_pipeline.py

Run mit Web-Research (braucht web_search-Tool-Zugang im Anthropic-Tier):
    python test_pipeline.py --with-research
"""
import json
import sys
from pathlib import Path

from schemas.briefing import Briefing
from agents.orchestrator import run_pipeline


def main():
    here = Path(__file__).parent
    mock_path = here / "mock_data" / "demo_hotel.json"

    with open(mock_path, encoding="utf-8") as f:
        briefing_raw = json.load(f)

    briefing = Briefing.model_validate(briefing_raw)
    with_research = "--with-research" in sys.argv
    skip_pipeline = "--from-cache" in sys.argv

    out_dir = here / "mock_data"
    out_path = out_dir / "demo_hotel_report.json"

    if skip_pipeline and out_path.exists():
        from schemas.outputs import FullReport
        with open(out_path, encoding="utf-8") as f:
            report = FullReport.model_validate_json(f.read())
        print("=== Verwende gecachten Report aus demo_hotel_report.json ===")
    else:
        report = run_pipeline(briefing, with_research=with_research)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(report.model_dump_json(indent=2))

    print("\n" + "=" * 60)
    print("EXECUTIVE SUMMARY")
    print("=" * 60)
    print(report.executive_summary)
    print("\n" + "=" * 60)
    print("KENNZAHLEN")
    print("=" * 60)
    print(f"Investment Y1:         {report.roi.total_investment_eur:>12,} €")
    print(f"Savings Y1:            {report.roi.total_savings_eur_year_1:>12,} €")
    print(f"Savings 3 Jahre:       {report.roi.total_savings_eur_3_years:>12,} €")
    print(f"Payback:               {report.roi.total_payback_months:>10} Monate")
    if report.roadmap:
        print(f"\nRoadmap:               {len(report.roadmap.phases)} Phasen, {report.roadmap.total_effort_pt} PT")
    if report.compliance:
        flagged = sum(1 for f in report.compliance.flags if f.dsgvo_relevant or f.ai_act_risk_class != "minimal")
        print(f"Compliance-Flags:      {flagged} mit DSGVO/AI-Act-Aufmerksamkeit")
    print(f"\nVoll-Report gespeichert: {out_path.relative_to(here)}")

    if "--generate-deliverables" in sys.argv or skip_pipeline:
        print("\n" + "=" * 60)
        print("DELIVERABLES GENERIEREN")
        print("=" * 60)
        deliverables_dir = out_dir / "deliverables"
        deliverables_dir.mkdir(parents=True, exist_ok=True)

        from outputs.excel_generator import generate_excel
        from outputs.pptx_generator import generate_pptx
        from outputs.pdf_generator import generate_pdf

        slug = "demo_hotel"

        xlsx = deliverables_dir / f"{slug}.xlsx"
        generate_excel(report, xlsx)
        print(f"  ✓ Excel:  {xlsx.relative_to(here)}")

        pptx = deliverables_dir / f"{slug}.pptx"
        generate_pptx(report, pptx)
        print(f"  ✓ PPTX:   {pptx.relative_to(here)}")

        pdf = deliverables_dir / f"{slug}.pdf"
        generate_pdf(report, pdf)
        print(f"  ✓ PDF:    {pdf.relative_to(here)}")


# ═══════════════════════════════════════════════════════════════════════════
# E2E-Smoke-Test-Suite (Issue ALE-37) — Schema + Supabase + Voice
# ═══════════════════════════════════════════════════════════════════════════
#
# Pytest-kompatible Struktur-/Smoke-Tests OHNE echte LLM- oder Netzwerk-Calls.
# Externe Abhängigkeiten (Supabase-Client-Konstruktion) werden gemockt.
# Ziel: schnell + deterministisch verifizieren, dass die Pipeline-Bausteine
# importierbar sind, die Output-Schemas validieren und der Voice-Fragenpool
# eine plausible Mindestmenge an Fragen liefert.
#
# Lauf:
#     pytest test_pipeline.py -v
#
# Hinweis: die Tests rufen NIE run_pipeline / die Anthropic-API auf — das ist
# bewusst der Aufgabe von main() oben (CLI) vorbehalten.

import importlib
import pytest

HERE = Path(__file__).parent
VOICE_DIR = HERE / "voice"


# --- Beispieldaten ----------------------------------------------------------

def _example_company() -> dict:
    """Minimal-realistisches Firmen-Kontext-Objekt für die Voice-Selektion.

    Werte sind bewusst neutral gehalten und triggern u.a. 'always'-Fragen.
    """
    return {
        "name": "Demo-Hotel Sonnenhof",
        "sub_segment": "Boutique-Hotel",
        "size_class": "M",
        "region": "DACH",
        "current_tools": ["PMS", "Kasse"],
        "pain_points": [
            {"description": "Hoher Personalaufwand in der Reservierung"},
        ],
    }


# --- 1) Schema-Smoke: alle Output-Schemas instanziierbar/validierbar --------

def test_schemas_module_imports():
    """schemas.outputs muss sauber importierbar sein (FullReport als Anker)."""
    mod = importlib.import_module("schemas.outputs")
    assert hasattr(mod, "FullReport")


def test_leaf_schemas_instantiate_with_minimal_data():
    """Die Blatt-/Teil-Schemas lassen sich mit Minimaldaten bauen + validieren."""
    from schemas.outputs import (
        ProcessAuditOutput,
        UseCaseOutput,
        ToolRecommendationOutput,
        ROIOutput,
        ComplianceOutput,
        RoadmapOutput,
        Process,
        UseCase,
        ToolRecommendation,
        ROILineItem,
    )

    audit = ProcessAuditOutput(processes=[], summary="leer")
    assert audit.processes == [] and audit.domains_unchecked == []

    process = Process(
        name="Reservierungs-Inbox",
        domain="front-office",
        description="Eingehende Mail-Anfragen werden manuell beantwortet.",
        primary_pain="Antwortzeit zu lang",
        automation_potential="high",
    )
    assert process.confidence == "medium"  # Default greift

    use_cases = UseCaseOutput(
        use_cases=[
            UseCase(
                name="Mail-Autoresponder",
                description="Klassifiziert + beantwortet Standard-Anfragen.",
                target_process="Reservierungs-Inbox",
                ai_pattern="classification",
                expected_impact="Schnellere Antwortzeit",
                complexity="medium",
                quick_win=True,
            )
        ],
        quick_wins_summary="1 Quick Win identifiziert",
    )
    assert use_cases.use_cases[0].quick_win is True

    tools = ToolRecommendationOutput(
        recommendations=[
            ToolRecommendation(
                use_case_name="Mail-Autoresponder",
                primary_tool="Beispiel-Tool",
                monthly_cost_eur=99,
                setup_complexity="low",
                why_this_tool="passt zum Stack",
                integration_with_existing="via PMS-API",
            )
        ],
        stack_summary="ein Tool",
    )
    assert tools.recommendations[0].time_to_value_weeks == 4  # Default

    roi = ROIOutput(
        line_items=[
            ROILineItem(
                use_case_name="Mail-Autoresponder",
                investment_eur_year_1=5000,
                savings_eur_year_1=12000,
                payback_months=5,
                three_year_roi_percent=140,
            )
        ],
        total_investment_eur=5000,
        total_savings_eur_year_1=12000,
        total_savings_eur_3_years=36000,
        total_payback_months=5.0,
        summary="positiver Business-Case",
    )
    assert roi.total_savings_eur_3_years == 36000

    compliance = ComplianceOutput(flags=[], general_advice="keine kritischen Flags")
    assert compliance.disclaimer  # Default-Disclaimer gesetzt

    roadmap = RoadmapOutput(phases=[], critical_path="—", total_effort_pt=0)
    assert roadmap.total_effort_pt == 0


def test_full_report_assembles_from_subschemas():
    """FullReport lässt sich aus den (minimalen) Teil-Outputs zusammensetzen."""
    from schemas.outputs import (
        FullReport,
        ProcessAuditOutput,
        UseCaseOutput,
        ToolRecommendationOutput,
        ROIOutput,
    )

    report = FullReport(
        company_name="Demo-Hotel Sonnenhof",
        audit=ProcessAuditOutput(processes=[], summary="leer"),
        use_cases=UseCaseOutput(use_cases=[], quick_wins_summary="—"),
        tools=ToolRecommendationOutput(recommendations=[], stack_summary="—"),
        roi=ROIOutput(
            line_items=[],
            total_investment_eur=0,
            total_savings_eur_year_1=0,
            total_savings_eur_3_years=0,
            total_payback_months=0.0,
            summary="—",
        ),
        executive_summary="Smoke-Test-Report ohne echte Empfehlungen.",
    )
    # Optionale Felder bleiben None, Roundtrip über JSON muss verlustfrei sein.
    assert report.pre_audit is None
    again = FullReport.model_validate_json(report.model_dump_json())
    assert again.company_name == "Demo-Hotel Sonnenhof"


def test_literal_validation_rejects_bad_enum():
    """Ein ungültiger Literal-Wert muss einen ValidationError auslösen."""
    from pydantic import ValidationError
    from schemas.outputs import Process

    with pytest.raises(ValidationError):
        Process(
            name="x",
            domain="nicht-existente-domain",  # ungültiges Literal
            description="…",
            primary_pain="…",
            automation_potential="high",
        )


# --- 2) Supabase: sauberer Import + mockbare Client-Konstruktion ------------

def test_supabase_module_imports():
    """agents._supabase muss ohne Netzwerk-Call importierbar sein."""
    mod = importlib.import_module("agents._supabase")
    for fn in ("get_client", "create_run", "save_agent_output", "complete_run"):
        assert hasattr(mod, fn), f"Erwartete Funktion {fn} fehlt"


def test_supabase_get_client_without_env_raises(monkeypatch):
    """Ohne SUPABASE_URL/ANON_KEY muss get_client kontrolliert abbrechen —
    KEIN echter Netzwerk-Call."""
    import agents._supabase as sb

    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_ANON_KEY", raising=False)
    with pytest.raises(RuntimeError):
        sb.get_client()


def test_supabase_get_client_is_mockable(monkeypatch):
    """Mit gemocktem create_client wird KEIN echtes Supabase angesprochen.
    Wir prüfen, dass URL + Anon-Key korrekt durchgereicht werden."""
    import agents._supabase as sb

    captured = {}

    class _FakeClient:
        pass

    def _fake_create_client(url, key):
        captured["url"] = url
        captured["key"] = key
        return _FakeClient()

    monkeypatch.setattr(sb, "create_client", _fake_create_client)
    monkeypatch.setenv("SUPABASE_URL", "https://demo.supabase.co")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "anon-test-key")

    client = sb.get_client()  # ohne user_jwt → keine Header-Manipulation
    assert isinstance(client, _FakeClient)
    assert captured == {"url": "https://demo.supabase.co", "key": "anon-test-key"}


# --- 3) Voice: Fragenpool + Hypothesen-Bäume laden fehlerfrei ---------------

def test_voice_pool_loads_questions():
    """voice.pool_loader lädt master_pool.yaml und liefert eine plausible
    Mindestanzahl Fragen (> 0, real ~105)."""
    from voice.pool_loader import load_pool

    pool = load_pool()
    assert isinstance(pool, list)
    assert len(pool) > 0
    # master_pool.yaml dokumentiert 105 Fragen — wir prüfen großzügig >= 50,
    # damit ein bewusst gekürzter Pool den Test nicht sofort bricht.
    assert len(pool) >= 50, f"Nur {len(pool)} Fragen im Pool — erwartet >= 50"
    # Struktur-Smoke: jede Frage hat mindestens id + question.
    sample = pool[0]
    assert "id" in sample and "question" in sample


def test_voice_select_questions_returns_subset():
    """select_questions liefert eine sinnvolle, begrenzte Auswahl (> 0)."""
    from voice.pool_loader import select_questions

    selected = select_questions(_example_company(), target_count=13)
    assert isinstance(selected, list)
    assert len(selected) > 0
    # Auswahl darf das Ziel nicht massiv überschreiten.
    assert len(selected) <= 13


def test_voice_hypothesis_trees_yaml_loads():
    """hypothesis_trees.yaml lädt fehlerfrei und enthält eine plausible
    Mindestanzahl Bäume (> 0, real ~25)."""
    yaml = pytest.importorskip("yaml")
    trees_path = VOICE_DIR / "hypothesis_trees.yaml"
    assert trees_path.exists(), "hypothesis_trees.yaml fehlt im voice/-Ordner"

    with trees_path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    trees = data.get("trees", [])
    assert isinstance(trees, list)
    assert len(trees) > 0
    assert len(trees) >= 10, f"Nur {len(trees)} Bäume — erwartet >= 10"
    # Struktur-Smoke: jeder Baum hat id + root_question.
    sample = trees[0]
    assert "id" in sample and "root_question" in sample


if __name__ == "__main__":
    main()
