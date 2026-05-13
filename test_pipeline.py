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


if __name__ == "__main__":
    main()
