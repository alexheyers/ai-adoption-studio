"""Agent 06 · Roadmap-Generator — Senior-Consultant-Niveau.

Drei-Phasen-Roadmap über 12 Monate. Die PHASEN-EINSORTIERUNG und alle ZAHLEN
(duration_months, estimated_effort_pt, total_effort_pt, Milestone-Wochen) werden
DETERMINISTISCH aus Use-Case-Komplexität, Tool-setup_complexity/time_to_value_weeks
und ROI-payback abgeleitet — keine Fantasiezahlen, keine LLM-Halluzination bei
Zahlen. call_agent wird nur für die FORMULIERUNGEN genutzt (expected_outcomes,
Milestone-Titel, Success-/Kill-Kriterien-Texte, Critical-Path-Satz). Schlägt der
LLM-Call fehl, greift ein deterministischer Fallback — die Roadmap entsteht in
jedem Fall.

Phasen-Logik:
  P1 Quick-Wins      — quick_win=True ODER kurzer payback (≤ 6 Mo) und complexity≠high
  P2 Foundation      — complexity=medium und kein Quick-Win
  P3 Scale           — complexity=high oder abhängige / aufwändige Use-Cases
"""
import json

from agents._client import call_agent
from schemas.briefing import Briefing
from schemas.outputs import (
    RoadmapOutput,
    RoadmapPhase,
    RoadmapMilestone,
    UseCaseOutput,
    ToolRecommendationOutput,
    ROIOutput,
)
from knowledge import case_studies_summary_text


# ───────────────────────── Deterministische Kalibrierung ─────────────────────────
# Personentage pro Use-Case nach Use-Case-Komplexität (Setup + Konfig + Test + Schulung + Rollout).
# Werte bewegen sich im im System-Prompt genannten Realismus-Korridor.
_PT_BY_COMPLEXITY = {"low": 6, "medium": 12, "high": 22}

# Zuschlag auf Personentage nach Setup-Komplexität des empfohlenen Tools.
_PT_TOOL_SETUP_SURCHARGE = {"low": 0, "medium": 3, "high": 7}

# Phasen-Namen + Default-Dauer-Bänder (werden unten anhand realer time_to_value überschrieben).
_PHASE_NAMES = {1: "Quick-Wins", 2: "Foundation", 3: "Scale"}
_PHASE_DEFAULT_DURATION = {1: "0-3 Monate", 2: "3-6 Monate", 3: "6-12 Monate"}
_PHASE_WEEK_OFFSET = {1: 0, 2: 12, 3: 24}  # informativ — Milestone-Wochen sind phasen-relativ


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Implementation-Director — vergleichbar mit einem Senior-Partner einer Digital-Transformation-Beratung (Capgemini Invent, Accenture Digital, BCG Digital Ventures). Du baust Roadmaps, die operativ umgesetzt werden — nicht Wunschlisten.

WICHTIG: Die Phasen-Einsortierung der Use-Cases, alle Personentage-Zahlen, Dauer-Bänder
und Milestone-Wochen sind BEREITS DETERMINISTISCH berechnet und werden dir unten als
PHASEN-GERÜST vorgegeben. Du erfindest KEINE Zahlen und verschiebst KEINE Use-Cases.
Deine Aufgabe ist ausschließlich, die Formulierungen mit Senior-Consultant-Tiefe zu füllen:
expected_outcomes, Milestone-Titel + success_criterion, success_metrics, kill_criteria,
decision_makers, dependencies, critical_path, critical_path_risks.

REGELN PRO PHASE:
- expected_outcomes: 2-3 Sätze KONKRET — welche Metrik bewegt sich von wo nach wo (nutze die übergebenen Use-Case-Impacts + ROI-Zahlen, erfinde keine eigenen)
- milestones: nutze EXAKT die vorgegebenen Wochen-Zahlen; formuliere Titel + messbares success_criterion
- success_metrics: 2-3 KPIs, abgeleitet aus den Use-Case-Impacts dieser Phase
- kill_criteria: 1-2 klare Abbruch-Schwellen (z.B. Adoption < 50% nach 6 Wochen)
- decision_makers: konkrete Rollen aus den Tool-Empfehlungen (GF, Reservierungs-Lead, Buchhaltung, DSB …)
- dependencies: was muss VORHER fertig sein (Phase-2 hängt typischerweise an Phase-1-Datenbasis, Phase-3 an Phase-2)

GLOBAL:
- critical_path: 1 Satz — welcher Use-Case ist der Engpass und warum (nutze das vorgegebene Gerüst)
- critical_path_risks: 2-3 konkrete Risiken, die den Critical Path kippen (Personalmangel im Onboarding, PMS-API-Reife, Datenqualität …)

WAS DU NIE TUST:
- Zahlen verändern, Use-Cases umsortieren, Phasen hinzufügen/entfernen
- Buzzword-Slang, generische Floskeln
- Personentage neu erfinden

OUTPUT — strikt JSON, exakt diese Struktur (gleiche Phasen-Reihenfolge + phase_number wie im Gerüst):

{
  "phases": [
    {
      "phase_number": 1,
      "expected_outcomes": "2-3 Sätze konkret mit Zahlen aus dem Gerüst",
      "milestones": [
        {"week": <vorgegeben>, "title": "...", "success_criterion": "..."}
      ],
      "success_metrics": ["...", "..."],
      "kill_criteria": ["..."],
      "decision_makers": ["GF", "..."],
      "dependencies": []
    }
  ],
  "critical_path": "1 Satz",
  "critical_path_risks": ["...", "..."]
}

────────────────────────────
{case_studies_block}
"""


# ───────────────────────── Deterministische Helfer ─────────────────────────

def _tool_index(tools: ToolRecommendationOutput) -> dict:
    """use_case_name → ToolRecommendation (erste Übereinstimmung)."""
    idx = {}
    for t in tools.recommendations:
        if t.use_case_name not in idx:
            idx[t.use_case_name] = t
    return idx


def _roi_index(roi: ROIOutput) -> dict:
    """use_case_name → ROILineItem (erste Übereinstimmung)."""
    idx = {}
    for r in roi.line_items:
        if r.use_case_name not in idx:
            idx[r.use_case_name] = r
    return idx


def _assign_phase(uc, roi_item) -> int:
    """Deterministische Phasen-Zuordnung 1-3.

    P1: Quick-Win ODER (kurzer Payback ≤ 6 Mo UND complexity ≠ high)
    P3: complexity = high
    P2: alles dazwischen (typisch complexity = medium)
    """
    payback = roi_item.payback_months if roi_item else None
    if uc.complexity == "high":
        return 3
    if uc.quick_win:
        return 1
    if payback is not None and payback <= 6 and uc.complexity != "high":
        return 1
    if uc.complexity == "low":
        # Low-Complexity ohne Quick-Win-Flag und ohne schnellen Payback → frühe Foundation
        return 2
    return 2


def _effort_pt_for(uc, tool) -> int:
    """Personentage pro Use-Case = Basis(Komplexität) + Tool-Setup-Zuschlag.

    Rein aus complexity + tool.setup_complexity abgeleitet — keine Fantasiezahl.
    """
    base = _PT_BY_COMPLEXITY.get(uc.complexity, _PT_BY_COMPLEXITY["medium"])
    surcharge = 0
    if tool is not None:
        surcharge = _PT_TOOL_SETUP_SURCHARGE.get(tool.setup_complexity, 0)
    return base + surcharge


def _phase_duration_band(phase_number: int, tools_in_phase: list) -> str:
    """Dauer-Band primär aus max(time_to_value_weeks) der Phasen-Tools abgeleitet.

    Fällt auf das Default-Band der Phase zurück, wenn keine time_to_value vorliegt.
    """
    ttv_weeks = [t.time_to_value_weeks for t in tools_in_phase if t and t.time_to_value_weeks]
    if not ttv_weeks:
        return _PHASE_DEFAULT_DURATION[phase_number]
    max_weeks = max(ttv_weeks)
    # Phase braucht mindestens so lange wie das langsamste Tool + Rollout-Puffer.
    end_month = max(1, round((max_weeks + 4) / 4.345))
    start_month = {1: 0, 2: 3, 3: 6}[phase_number]
    end_month = max(end_month, start_month + 1)
    # Obergrenzen pro Phase respektieren (12-Monats-Horizont).
    cap = {1: 3, 2: 6, 3: 12}[phase_number]
    end_month = min(end_month, cap)
    return f"{start_month}-{end_month} Monate"


def _milestone_weeks(phase_number: int, tools_in_phase: list) -> list[int]:
    """Drei Milestone-Wochen (phasen-relativ), kalibriert an time_to_value des Stacks."""
    ttv_weeks = [t.time_to_value_weeks for t in tools_in_phase if t and t.time_to_value_weeks]
    base_ttv = max(ttv_weeks) if ttv_weeks else {1: 8, 2: 14, 3: 20}[phase_number]
    # Onboarding ~ 1/4, Live-Test ~ am time-to-value, Vollbetrieb ~ +50% Puffer.
    m1 = max(2, round(base_ttv * 0.25))
    m2 = max(m1 + 2, base_ttv)
    m3 = max(m2 + 2, round(base_ttv * 1.5))
    return [m1, m2, m3]


def _fallback_milestones(weeks: list[int], phase_number: int) -> list[RoadmapMilestone]:
    titles = [
        ("Onboarding & Setup abgeschlossen", "Tool produktiv konfiguriert, Team eingewiesen"),
        ("Erster Live-Test mit Echt-Daten", "Use-Case läuft im Parallelbetrieb mit Real-Volumen"),
        ("Voll im Tagesbetrieb", "Use-Case ist Standard-Workflow, manueller Alt-Prozess abgelöst"),
    ]
    out = []
    for w, (title, crit) in zip(weeks, titles):
        out.append(RoadmapMilestone(week=w, title=title, success_criterion=crit))
    return out


def _build_skeleton(use_cases, tool_idx, roi_idx):
    """Erzeugt die deterministische Phasen-Struktur (ohne LLM-Texte).

    Rückgabe: (skeleton_dict_pro_phase, geordnete_phase_numbers).
    """
    buckets: dict[int, list] = {1: [], 2: [], 3: []}
    for uc in use_cases:
        roi_item = roi_idx.get(uc.name)
        phase = _assign_phase(uc, roi_item)
        buckets[phase].append(uc)

    # Innerhalb jeder Phase nach Payback aufsteigend sortieren (schnellster Wert zuerst),
    # fehlender Payback ans Ende.
    def _sort_key(uc):
        ri = roi_idx.get(uc.name)
        return ri.payback_months if (ri and ri.payback_months is not None) else 999

    skeletons = []
    for phase_number in (1, 2, 3):
        ucs = sorted(buckets[phase_number], key=_sort_key)
        if not ucs:
            continue
        tools_in_phase = [tool_idx.get(uc.name) for uc in ucs]
        required_tools = []
        for t in tools_in_phase:
            if t and t.primary_tool and t.primary_tool not in required_tools:
                required_tools.append(t.primary_tool)
        effort = sum(_effort_pt_for(uc, tool_idx.get(uc.name)) for uc in ucs)
        weeks = _milestone_weeks(phase_number, tools_in_phase)
        duration = _phase_duration_band(phase_number, tools_in_phase)
        skeletons.append({
            "phase_number": phase_number,
            "name": _PHASE_NAMES[phase_number],
            "duration_months": duration,
            "use_case_names": [uc.name for uc in ucs],
            "use_case_objs": ucs,
            "required_tools": required_tools,
            "estimated_effort_pt": effort,
            "milestone_weeks": weeks,
        })
    return skeletons


def _derive_dependencies(skeletons: list, phase_number: int) -> list[str]:
    """Deterministische Default-Dependencies: jede Phase hängt an der vorigen."""
    prev = [s for s in skeletons if s["phase_number"] < phase_number]
    if not prev:
        return []
    prev_phase = prev[-1]
    return [f"{prev_phase['name']} (Phase {prev_phase['phase_number']}) abgeschlossen — Datenbasis + Team-Adoption stehen"]


def _fallback_outcomes(skel, roi_idx) -> str:
    names = skel["use_case_names"]
    paybacks = [roi_idx[n].payback_months for n in names if n in roi_idx and roi_idx[n].payback_months is not None]
    pb = f" Schnellster Payback in dieser Phase: {min(paybacks)} Monate." if paybacks else ""
    head = ", ".join(names[:3]) if names else "die Phasen-Use-Cases"
    return (f"Phase setzt {head} produktiv um ({skel['estimated_effort_pt']} PT). "
            f"Erwarteter Effekt: messbare Entlastung in den adressierten Prozessen über {skel['duration_months']}.{pb}")


def _fallback_decision_makers(skel, tool_idx) -> list[str]:
    dms: list[str] = ["GF"]
    for n in skel["use_case_names"]:
        t = tool_idx.get(n)
        if t:
            for dm in t.decision_makers_needed:
                if dm and dm not in dms:
                    dms.append(dm)
    return dms[:4]


def _build_phase_from_skeleton(skel, llm_phase, roi_idx, tool_idx, skeletons) -> RoadmapPhase:
    """Verschmilzt deterministisches Gerüst mit LLM-Texten (LLM nur für Formulierungen)."""
    weeks = skel["milestone_weeks"]

    # Milestones: Wochen kommen IMMER aus dem Gerüst, Texte vom LLM falls vorhanden.
    milestones: list[RoadmapMilestone] = []
    llm_ms = (llm_phase or {}).get("milestones") or []
    if llm_ms:
        for i, w in enumerate(weeks):
            src = llm_ms[i] if i < len(llm_ms) else {}
            title = (src.get("title") or "").strip()
            crit = (src.get("success_criterion") or "").strip()
            if not title or not crit:
                fb = _fallback_milestones([w], skel["phase_number"])[0]
                title = title or fb.title
                crit = crit or fb.success_criterion
            milestones.append(RoadmapMilestone(week=w, title=title, success_criterion=crit))
    else:
        milestones = _fallback_milestones(weeks, skel["phase_number"])

    expected_outcomes = (llm_phase or {}).get("expected_outcomes", "").strip() or _fallback_outcomes(skel, roi_idx)
    success_metrics = (llm_phase or {}).get("success_metrics") or []
    kill_criteria = (llm_phase or {}).get("kill_criteria") or [
        f"Wenn nach {weeks[0] + 2} Wochen die Team-Adoption < 50% liegt → Phase pausieren und Onboarding nachschärfen"
    ]
    decision_makers = (llm_phase or {}).get("decision_makers") or _fallback_decision_makers(skel, tool_idx)
    dependencies = (llm_phase or {}).get("dependencies")
    if not dependencies:
        dependencies = _derive_dependencies(skeletons, skel["phase_number"])

    return RoadmapPhase(
        phase_number=skel["phase_number"],
        name=skel["name"],
        duration_months=skel["duration_months"],
        use_cases=skel["use_case_names"],
        required_tools=skel["required_tools"],
        estimated_effort_pt=skel["estimated_effort_pt"],
        dependencies=dependencies,
        expected_outcomes=expected_outcomes,
        milestones=milestones,
        success_metrics=success_metrics,
        kill_criteria=kill_criteria,
        decision_makers=decision_makers,
    )


def _fallback_critical_path(skeletons, roi_idx) -> tuple[str, list[str]]:
    """Deterministischer Critical-Path: der aufwändigste Use-Case der höchsten Phase."""
    if not skeletons:
        return "Kein Critical Path ableitbar — keine Use-Cases in der Roadmap.", []
    # Engpass = Phase mit höchster phase_number, darin der Use-Case mit längstem Payback.
    last = skeletons[-1]
    names = last["use_case_names"]
    bottleneck = names[0] if names else last["name"]
    longest_pb = None
    for n in names:
        ri = roi_idx.get(n)
        if ri and ri.payback_months is not None:
            if longest_pb is None or ri.payback_months > longest_pb[1]:
                longest_pb = (n, ri.payback_months)
    if longest_pb:
        bottleneck = longest_pb[0]
    cp = (f"Engpass ist '{bottleneck}' in der {last['name']}-Phase ({last['duration_months']}, "
          f"{last['estimated_effort_pt']} PT) — er hängt an der in den früheren Phasen aufgebauten "
          f"Datenbasis und Team-Adoption und kann den 12-Monats-Horizont kippen.")
    risks = [
        "Personalmangel im Onboarding-Zeitraum verzögert Phase 1 und schiebt alle Folge-Phasen",
        "Reife/Stabilität der PMS-/POS-Schnittstellen reicht nicht für die geplante Integration",
        "Datenqualität aus den Vorphasen zu niedrig für die Skalierungs-Use-Cases",
    ]
    return cp, risks


# ───────────────────────────────── run() ─────────────────────────────────

def run(
    briefing: Briefing,
    use_cases: UseCaseOutput,
    tools: ToolRecommendationOutput,
    roi: ROIOutput,
) -> RoadmapOutput:
    sub_segment_raw = (briefing.company.sub_segment or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique", "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel", "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")
    cs_text = case_studies_summary_text(filter_segment=sub_segment, max_items=8)

    tool_idx = _tool_index(tools)
    roi_idx = _roi_index(roi)

    # 1) Deterministisches Phasen-Gerüst bauen (Einsortierung + alle Zahlen).
    skeletons = _build_skeleton(use_cases.use_cases, tool_idx, roi_idx)

    # Defensive: keine Use-Cases → leere, valide Roadmap.
    if not skeletons:
        return RoadmapOutput(
            phases=[],
            critical_path="Kein Critical Path ableitbar — keine Use-Cases vorhanden.",
            critical_path_risks=[],
            total_effort_pt=0,
        )

    # 2) call_agent NUR für Formulierungen — Gerüst als Kontext mitgeben.
    system = SYSTEM_PROMPT_TEMPLATE.replace("{case_studies_block}", cs_text)

    skeleton_for_llm = [{
        "phase_number": s["phase_number"],
        "name": s["name"],
        "duration_months": s["duration_months"],
        "estimated_effort_pt": s["estimated_effort_pt"],
        "milestone_weeks": s["milestone_weeks"],
        "use_cases": [
            {
                "name": uc.name,
                "expected_impact": uc.expected_impact,
                "complexity": uc.complexity,
                "ai_pattern": uc.ai_pattern,
                "payback_months": (roi_idx[uc.name].payback_months if uc.name in roi_idx else None),
                "primary_tool": (tool_idx[uc.name].primary_tool if uc.name in tool_idx else None),
                "decision_makers_needed": (tool_idx[uc.name].decision_makers_needed if uc.name in tool_idx else []),
            }
            for uc in s["use_case_objs"]
        ],
    } for s in skeletons]

    user_message = json.dumps({
        "company": {
            "name": briefing.company.name,
            "size_class": briefing.company.size_class,
            "employees": briefing.company.employees,
        },
        "phase_skeleton": skeleton_for_llm,
        "instruction": (
            "Fülle pro Phase NUR die Formulierungs-Felder. Übernimm Wochen + Phasen-Reihenfolge "
            "exakt aus dem Gerüst. Liefere zusätzlich critical_path + critical_path_risks."
        ),
    }, ensure_ascii=False)

    llm_phases_by_num: dict = {}
    llm_critical_path = ""
    llm_critical_path_risks: list[str] = []
    try:
        raw = call_agent(system, user_message)
        for p in raw.get("phases", []):
            pn = p.get("phase_number")
            if pn in (1, 2, 3):
                llm_phases_by_num[pn] = p
        llm_critical_path = (raw.get("critical_path") or "").strip()
        llm_critical_path_risks = raw.get("critical_path_risks") or []
    except Exception:
        # LLM nicht verfügbar / unparsbar → rein deterministischer Fallback.
        llm_phases_by_num = {}

    # 3) Phasen verschmelzen (deterministische Zahlen gewinnen immer).
    phases = [
        _build_phase_from_skeleton(s, llm_phases_by_num.get(s["phase_number"]), roi_idx, tool_idx, skeletons)
        for s in skeletons
    ]

    # 4) Critical-Path: LLM-Satz falls vorhanden, sonst deterministisch.
    fb_cp, fb_risks = _fallback_critical_path(skeletons, roi_idx)
    critical_path = llm_critical_path or fb_cp
    critical_path_risks = llm_critical_path_risks or fb_risks

    # 5) total_effort_pt = Summe der Phasen (deterministisch, keine LLM-Zahl).
    total_effort_pt = sum(p.estimated_effort_pt for p in phases)

    return RoadmapOutput(
        phases=phases,
        critical_path=critical_path,
        critical_path_risks=critical_path_risks,
        total_effort_pt=total_effort_pt,
    )
