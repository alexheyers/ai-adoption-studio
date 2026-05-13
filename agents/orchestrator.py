"""Orchestrator (CLI/Test-Variante): führt alle Agents lokal ohne Supabase aus.

Für HTTP-Backend siehe runs/pipeline_runner.py.
"""
import os
import time
from schemas.briefing import Briefing
from schemas.outputs import FullReport
from agents import (
    process_auditor, use_case_generator, tool_recommender, roi_calculator,
    compliance_checker, roadmap_generator, reporter,
)

# Pause zwischen Agent-Calls, um Anthropic-Rate-Limit (Tier 1: 30k Tokens/Min) zu schonen.
_PAUSE_SECONDS = float(os.getenv("AGENT_PAUSE_SECONDS", "8"))  # ~25k Tokens pro Call mit Phase-13-Tiefe → 25k/30k = 50s Erholung bei Tier 1; Pause + Verarbeitungszeit reicht typischerweise


def run_pipeline(briefing: Briefing, verbose: bool = True, with_research: bool = False) -> FullReport:
    if verbose:
        print(f"\n=== Pipeline-Start: {briefing.company.name} ===\n")

    web_research_output = None
    if with_research:
        if verbose: print("[0] Web-Research-Agent läuft …")
        from agents import web_research
        web_research_output = web_research.run({
            "name": briefing.company.name,
            "sub_segment": briefing.company.sub_segment,
            "region": briefing.company.region,
        })
        if verbose: print(f"      → {len(web_research_output.sources)} Quellen, Summary: {web_research_output.summary[:80]}…")

    if verbose: print("[1/7] Process-Auditor …")
    audit = process_auditor.run(briefing)
    if verbose: print(f"      → {len(audit.processes)} Prozesse identifiziert")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[2/7] Use-Case-Generator …")
    use_cases = use_case_generator.run(briefing, audit)
    quick_wins = sum(1 for u in use_cases.use_cases if u.quick_win)
    if verbose: print(f"      → {len(use_cases.use_cases)} Use-Cases, davon {quick_wins} Quick Wins")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[3/7] Tool-Recommender …")
    tools = tool_recommender.run(briefing, use_cases)
    if verbose: print(f"      → {len(tools.recommendations)} Tool-Empfehlungen")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[4/7] ROI-Calculator …")
    roi = roi_calculator.run(briefing, audit, use_cases, tools)
    if verbose:
        print(f"      → Investment Y1: {roi.total_investment_eur:,} €")
        print(f"      → Savings Y1: {roi.total_savings_eur_year_1:,} €")
        print(f"      → Payback: {roi.total_payback_months} Monate")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[5/7] Compliance-Checker …")
    compliance = compliance_checker.run(briefing, use_cases, tools)
    if verbose: print(f"      → {len(compliance.flags)} Compliance-Flags")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[6/7] Roadmap-Generator …")
    roadmap = roadmap_generator.run(briefing, use_cases, tools, roi)
    if verbose: print(f"      → {len(roadmap.phases)} Phasen, {roadmap.total_effort_pt} PT total")
    time.sleep(_PAUSE_SECONDS)

    if verbose: print("[7/7] Reporter aggregiert …")
    report = reporter.run(
        briefing, audit, use_cases, tools, roi,
        compliance=compliance, roadmap=roadmap, web_research=web_research_output,
    )

    if verbose: print("\n=== Pipeline fertig ===\n")
    return report
