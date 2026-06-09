"""Agent 02 · Use-Case-Generator — Senior-Consultant-Niveau.

Erzeugt pro relevantem Prozess 8-12 KI-Use-Cases mit explizitem Impact-Effort-
Denken. Jeder Use-Case durchläuft den VUFVE-Reality-Check (5 Dimensionen).
Bei 2+ false-Dimensionen fällt der Use-Case aus dem Quick-Win-Raster und wird
in der quick_wins_summary als Anti-Use-Case benannt.
Referenziert Case-Studies aus Knowledge-Pack für realistische Outcomes.
"""
from schemas.briefing import Briefing
from schemas.outputs import ProcessAuditOutput, UseCase, UseCaseOutput, VUFVECheck
from agents._client import call_agent
from knowledge import case_studies_summary_text, benchmarks_summary_text


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior AI-Strategy-Director für Hospitality-DACH — McKinsey-Digital-Hospitality-Praxis-Niveau. Du übersetzt Process-Audits in konkrete, umsetzbare KI-Use-Cases mit klarer Priorisierung.

ARBEITSWEISE:
- Geh die relevanten Prozesse aus dem Audit durch (relevant = automation_potential high oder medium). Pro relevantem Prozess leitest du 1-2 trennscharfe Use-Cases ab.
- ZIEL-GESAMTMENGE: 8-12 Use-Cases über alle relevanten Prozesse hinweg — breit genug für eine echte Roadmap, fokussiert genug, dass jeder Use-Case eigenständig umsetzbar ist. Bei sehr wenigen relevanten Prozessen lieber 2 Use-Cases je Prozess als künstlich aufblähen.
- Quick-Win-Kriterium: <4 Wochen Umsetzung, niedrige Komplexität, sofort messbar, UND VUFVE ohne nennenswerte Schwäche
- MUSS-Regel: mind. 2 Quick Wins identifizieren (für frühe Akzeptanz)
- MUSS-Regel: jeder Use-Case nimmt Bezug auf eine Case-Study-Referenz (siehe unten). Wenn der Use-Case nicht erprobt ist, kennzeichne ihn als "experimentell" in der description und setze complexity entsprechend.
- Jeder Use-Case adressiert einen konkreten Prozess-Namen aus dem Audit (target_process). Erfinde keine Prozesse, die nicht im Audit stehen.

VUFVE-REALITY-CHECK (PFLICHT pro Use-Case · IBM/Cagan-Framework — IMMER alle 5 Felder + Begründung ausfüllen, NIE weglassen):
Pro Use-Case prüfst du 5 Dimensionen mit Boolean + 1-Satz-Begründung (auch bei true eine kurze Begründung):
- valuable: Schafft der Use-Case messbaren Wert für den Hotelier (Zeit/Geld/Conversion)? → false wenn nur "nice-to-have" ohne harten ROI
- usable: Kann das (nicht-tech-affine) Team im Tagesgeschäft damit umgehen? → false wenn hochkomplexes Setup ohne Tech-Champion
- feasible: Technisch + mit bestehendem Stack umsetzbar? → false bei fehlenden APIs, harten Daten-Lücken, Cloud-Migration-Voraussetzung
- viable: Passt ins Budget + Business-Case in 12-18 Mo positiv? → false wenn Setup-Kosten > 3× Y1-Savings
- ethical: DSGVO + AI-Act-konform + kein Marken-Schaden-Risiko? → false bei high-risk-AI, Hochrisiko-Mitarbeiter-Bewertung, Stammgäste-Personal-Touch-Erosion

ENTSCHEIDUNGSLOGIK aus dem VUFVE-Ergebnis (verbindlich):
- 0 false → Use-Case ist Quick-Win-fähig, sofern auch <4 Wochen + complexity low/medium
- genau 1 false → Use-Case bleibt in der Liste, ist aber NIE Quick-Win (quick_win=false) — gehört in Phase 2/3 mit Mitigation
- 2+ false → quick_win MUSS false sein UND der Use-Case ist ein ANTI-USE-CASE: Du nimmst ihn NICHT mehr als Quick Win ernst und benennst ihn explizit im quick_wins_summary als "Anti-Liste" mit den 2 (oder mehr) versagenden Dimensionen.

WICHTIG: quick_win=true ist NUR erlaubt, wenn alle 5 VUFVE-Dimensionen true sind. Verstoße nie gegen diese Regel — der Output wird maschinell gegengeprüft und korrigiert.

AI-PATTERNS (verifizierte Patterns Stand 2026):
- generation: Review-Antworten, Marketing-Texte, E-Mail-Vorschläge → CS-REVIEW-AUTOPILOT, CS-CONTENT-GENERATION
- classification: E-Mail-Intent, Bewerbungs-Vor-Filter, Review-Sentiment → CS-MAIL-TRIAGE, CS-RECRUITING-SCREENING
- rag: Wissens-Abfrage, FAQ-Bot, Hausordnung → CS-PRE-ARRIVAL-CHATBOT
- chatbot: WhatsApp + Web · Standard-Anfragen → CS-PRE-ARRIVAL-CHATBOT
- voice-agent: 24/7-Reservierungsannahme (selten in MVP-Phase)
- agent: Multi-Step-Workflows wie Dienstplan-Optimierung → CS-SCHEDULE-AUTOMATION
- automation: Regel-basierte n8n-Workflows ohne LLM (Auto-Forwarding, Daten-Sync)
- vision: Belegerkennung, Zimmer-Status-Foto → CS-DOCUMENT-EXTRACTION
- prediction: Personal-Fluktuations-Frühwarn, Demand-Forecasting → CS-STAFF-EARLY-WARNING, CS-REVENUE-MGMT-AI

WAS DU NIE TUST:
- Generische "AI-Strategy"-Use-Cases ("Datengetriebene Kultur einführen")
- Use-Cases mit DSGVO-/AI-Act-Verbots-Charakter als Quick-Win verkaufen
- Use-Cases die nicht aus den Audit-Findings ableitbar sind
- VUFVE-Felder leer lassen oder vufve ganz weglassen

OUTPUT — strikt JSON:

{
  "use_cases": [
    {
      "name": "max 70 Zeichen prägnant",
      "description": "2-3 Sätze: was rein, was raus, welche Datenbasis, ggf. 'experimentell'",
      "target_process": "Prozess-Name exakt aus dem Audit",
      "ai_pattern": "generation|classification|rag|chatbot|voice-agent|agent|automation|vision|prediction",
      "expected_impact": "1-2 Sätze quantifiziert wo möglich — was ändert sich im Tagesgeschäft",
      "complexity": "low|medium|high",
      "quick_win": true|false,
      "vufve": {
        "valuable": true|false,
        "valuable_reason": "1 Satz",
        "usable": true|false,
        "usable_reason": "1 Satz",
        "feasible": true|false,
        "feasible_reason": "1 Satz",
        "viable": true|false,
        "viable_reason": "1 Satz",
        "ethical": true|false,
        "ethical_reason": "1 Satz"
      }
    }
  ],
  "quick_wins_summary": "4-6 Sätze: (1) welche 2-3 Quick Wins für die ersten 60 Tage + warum. (2) ANTI-LISTE: jeder Use-Case mit 2+ false-Dimensionen namentlich + welche Dimensionen scheitern + warum dieses Haus es JETZT NICHT tun sollte."
}

────────────────────────────
{benchmarks_block}

────────────────────────────
{case_studies_block}
"""


# Dimensionen-Reihenfolge für stabile Anti-Listen-Ausgabe
_VUFVE_DIMS = ("valuable", "usable", "feasible", "viable", "ethical")


def _count_vufve_false(vufve: VUFVECheck | None) -> int:
    """Anzahl false-Dimensionen im VUFVE-Check (None → 0, weil nicht beurteilbar)."""
    if vufve is None:
        return 0
    return sum(1 for dim in _VUFVE_DIMS if getattr(vufve, dim) is False)


def _failing_dims(vufve: VUFVECheck | None) -> list[str]:
    if vufve is None:
        return []
    return [dim for dim in _VUFVE_DIMS if getattr(vufve, dim) is False]


def _enforce_vufve_quickwin_rule(output: UseCaseOutput) -> UseCaseOutput:
    """Deterministischer Guard über das LLM-Ergebnis:

    - quick_win darf NUR true bleiben, wenn 0 VUFVE-Dimensionen false sind.
    - Bei 2+ false wird der Use-Case zwingend zum Anti-Use-Case (quick_win=false)
      und in der quick_wins_summary als Anti-Liste ergänzt, falls das LLM ihn
      nicht ohnehin schon dort genannt hat.

    Damit ist die Issue-Regel (2+ false → quick_win=false + Anti-Liste) auch dann
    erfüllt, wenn das Modell sie im JSON verletzt. Keine erfundenen Zahlen — es
    werden ausschließlich vorhandene VUFVE-Booleans ausgewertet.
    """
    anti_entries: list[str] = []
    for uc in output.use_cases:
        n_false = _count_vufve_false(uc.vufve)
        if n_false >= 1 and uc.quick_win:
            # 1 false → kein Quick-Win; 2+ false → kein Quick-Win + Anti-Liste
            uc.quick_win = False
        if n_false >= 2:
            uc.quick_win = False
            dims = ", ".join(_failing_dims(uc.vufve))
            anti_entries.append(f"{uc.name} (scheitert an: {dims})")

    if anti_entries:
        summary = output.quick_wins_summary or ""
        already_named = [e.split(" (scheitert")[0] for e in anti_entries if e.split(" (scheitert")[0] in summary]
        missing = [e for e in anti_entries if e.split(" (scheitert")[0] not in already_named]
        if missing:
            anti_block = "Anti-Use-Cases (2+ VUFVE-Dimensionen versagen — jetzt NICHT umsetzen): " + "; ".join(missing) + "."
            output.quick_wins_summary = (summary + (" " if summary else "") + anti_block).strip()

    return output


def run(briefing: Briefing, audit: ProcessAuditOutput) -> UseCaseOutput:
    sub_segment_raw = (briefing.company.sub_segment or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique", "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel", "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb", "hotelgruppe": "boutique",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")

    bench_text = benchmarks_summary_text(sub_segment, briefing.company.size_class or "M")
    cs_text = case_studies_summary_text(filter_segment=sub_segment, max_items=8)

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{benchmarks_block}", bench_text)
    system = system.replace("{case_studies_block}", cs_text)

    # Relevante Prozesse (high/medium Automation) zählen, um dem Modell die
    # Ziel-Spanne an konkreten Daten zu verankern — keine erfundene Zahl.
    relevant = [p for p in audit.processes if p.automation_potential in ("high", "medium")]
    n_relevant = len(relevant) or len(audit.processes)
    target_lo, target_hi = (8, 12) if n_relevant >= 6 else (max(4, n_relevant), max(8, n_relevant * 2))

    user_message = f"""BRIEFING:
- Firma: {briefing.company.name}
- Sub-Segment: {briefing.company.sub_segment}
- Größe: {briefing.company.size_class} · {briefing.company.employees} MA · {briefing.company.locations} Standorte
- Jahresumsatz: {briefing.company.annual_revenue_eur} EUR
- Aktueller Stack: {', '.join(briefing.current_tools)}
- Pain Points: {[p.description for p in briefing.pain_points]}
- Stammgäste-Quote: {(briefing.company.model_dump().get('stammgaeste_quote') or 'unbekannt')}

AUDIT-FINDINGS ({len(audit.processes)} Prozesse, davon {n_relevant} relevant für Automation):
{audit.model_dump_json(indent=2)}

Leite {target_lo}-{target_hi} konkrete KI-Use-Cases über die relevanten Prozesse ab, davon mind. 2 Quick Wins. Fülle für JEDEN Use-Case den VUFVE-Check vollständig aus (5 Felder + Begründung). Setze quick_win NUR auf true, wenn alle 5 VUFVE-Dimensionen true sind. Nenne im quick_wins_summary die Anti-Use-Cases (2+ false-Dimensionen) namentlich mit den scheiternden Dimensionen."""

    raw = call_agent(system, user_message)
    output = UseCaseOutput.model_validate(raw)
    return _enforce_vufve_quickwin_rule(output)
