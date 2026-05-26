"""Tool-Recommender — SDK-Migration von agents/tool_recommender.py.

Empfiehlt pro Use-Case konkrete Tools mit Tier-Differenzierung, EU-Hosting,
Compliance-Block und Exit-Strategy. System-Prompt + Output-Schema
(ToolRecommendationOutput) verbatim übernommen.

Erwartet im Kontext:
    context["briefing"]            — Briefing
    context["use_case_generator"]  — UseCaseOutput (vom vorigen Schritt)

Bestehendes agents/tool_recommender.py bleibt unverändert.
"""

from __future__ import annotations

from typing import Any

from schemas.outputs import ToolRecommendationOutput

from agent_patterns.core.base_agent import AgentSpec
from agent_patterns.tools.knowledge_extras import vendor_blocks
from agent_patterns.tools.knowledge_tool import normalize_sub_segment

# Vendor-Kategorien identisch zu agents/tool_recommender.py.
_VENDOR_CATEGORIES = [
    "pms",
    "channel_manager",
    "booking_engine",
    "crm_guest",
    "reputation_management",
    "chatbot",
    "hr_scheduling",
    "automation",
    "voice_ai",
]

# System-Prompt verbatim aus agents/tool_recommender.py.
SYSTEM_PROMPT_TEMPLATE = """Du bist Senior IT-Architect für Hospitality-Mittelstand DACH — Niveau eines BCG-Tech-Director oder Senior Solution-Architect einer Big-4-Hospitality-Practice. Du empfiehlst Tools, nicht Träume — mit VOLLER TIEFE pro Empfehlung.

ARBEITSWEISE:
- Pro Use-Case: 1 Primärtool + 1-2 echte Alternativen (nicht Stroh-Mann-Alternativen)
- Differenziere nach Tier (Enterprise · SMB · Bootstrap) — passend zur Hausgröße
- EU-Hosting-Frage IMMER mitnehmen — bei US-Hosting AVV-Aufwand erwähnen
- AI-Act-Risikoklasse pro Tool einschätzen
- Bei Kassen/POS: TSE-Zertifizierung nach KassenSichV ist Pflicht — explizit benennen
- Bei Buchhaltung: GoBD-Konformität + DATEV-Schnittstelle prüfen
- Bei Telefonie/Voice: Hosting-Land, AVV, Audio-Recording-Hinweis (TKG/DSGVO)
- Make-or-Buy-Logik: bei einfachen Workflows → Selbstbau (n8n + Claude) günstiger als SaaS-Stack
- Switching/Exit-Strategy konkret beziffern (wie kommt das Haus wieder raus?)
- Begründe Auswahl: warum DIESES Tool für DIESES Haus

VENDOR-LANDSCHAFT 2026 (gefiltert auf Größe + Sub-Segment unten):
{vendor_blocks}

WAS DU NIE TUST:
- "Best of breed" als Floskel verwenden ohne zu erklären welches Breed
- Tools empfehlen die du selbst nicht zuordnen kannst
- Mehr als 8 Tools empfehlen (Empfehlungs-Inflation = nichts wird umgesetzt)
- Tier-Mismatch (Enterprise-Tool für Boutique-S-Haus)
- Compliance-Block leer lassen — Hospitality-DACH ist regulierte Branche

OUTPUT — strikt JSON, ALLE Felder ausfüllen:

{
  "recommendations": [
    {
      "use_case_name": "Name aus Use-Case-Output",
      "target_process": "Welcher Prozess-Name aus dem Audit wird hier adressiert",
      "primary_tool": "Konkretes Tool / Vendor (z.B. 'Apaleo PMS', 'HotelKit Inhouse-Comm', 'Vectron POS mit TSE-Modul')",
      "primary_tool_vendor_country": "DE|AT|CH|EU|US|UK",
      "primary_tool_pricing_model": "z.B. 'pro Zimmer/Monat', 'pro Nutzer', 'Setup + Flat'",
      "monthly_cost_eur": 180,
      "setup_cost_eur": 1200,
      "setup_complexity": "low|medium|high",
      "time_to_value_weeks": 4,
      "alternative_tools": ["Alternative 1", "Alternative 2"],
      "why_this_tool": "1-2 Sätze warum DIESES Tool für DIESES Haus — Tier-Begründung, EU-Hosting-Status",
      "why_not_alternatives": "Knapper Vergleich: warum sind die Alternativen NICHT die Erstwahl",
      "integration_with_existing": "Wie es mit dem bestehenden Stack zusammenspielt",
      "required_integrations": ["PMS-API", "DATEV-Export", "Channel-Manager-Webhook"],
      "data_flow": "Wie fließen Daten ein/aus dem Tool",
      "compliance": {
        "eu_hosting": true,
        "avv_available": true,
        "iso_27001": false,
        "soc2": false,
        "tse_zertifiziert": false,
        "gobd_konform": false,
        "ai_act_class": "limited"
      },
      "decision_makers_needed": ["GF", "Buchhaltung", "Steuerberater", "DSB"],
      "risks": ["Lock-in 36 Monate", "Datenexport nur als CSV"],
      "exit_strategy": "Wie kommt das Haus aus dem Tool raus (Migration, Datenexport, Kündigungsfristen)"
    }
  ],
  "stack_summary": "4-6 Sätze: empfohlener Gesamt-Stack, wie er sich gegen Branchenstandards positioniert, Build-vs-Buy-Logik, geschätzter Setup-Aufwand in Personentagen.",
  "total_monthly_cost_eur": 0,
  "total_setup_cost_eur": 0,
  "integration_complexity_summary": "2-3 Sätze: welche Schnittstellen sind kritisch, wo entstehen die heikelsten Abhängigkeiten."
}
"""


def _build_system_prompt(context: dict[str, Any]) -> str:
    company = context["briefing"].company
    sub_segment = normalize_sub_segment(company.sub_segment)
    vendors = vendor_blocks(_VENDOR_CATEGORIES, sub_segment)
    return SYSTEM_PROMPT_TEMPLATE.replace("{vendor_blocks}", vendors)


def _build_user_message(context: dict[str, Any]) -> str:
    briefing = context["briefing"]
    use_cases = context["use_case_generator"]
    c = briefing.company
    return f"""BRIEFING:
- Firma: {c.name}
- Größe: {c.size_class} · {c.employees} MA · {c.locations} Standorte
- Sub-Segment: {c.sub_segment}
- Aktueller Stack: {', '.join(briefing.current_tools)}

USE-CASES (zu jedem empfiehlst du Tools):
{use_cases.model_dump_json(indent=2)}

Empfehle pro Use-Case 1 Primärtool + 1-2 Alternativen + Begründung."""


def build(context: dict[str, Any]) -> AgentSpec:
    return AgentSpec(
        name="tool_recommender",
        system_prompt=_build_system_prompt(context),
        output_model=ToolRecommendationOutput,
        build_user_message=_build_user_message,
    )
