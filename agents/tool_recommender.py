"""Agent 03 · Tool-Recommender — Senior-Consultant-Niveau.

Empfiehlt pro Use-Case ein Primärtool + 2 echte Alternativen (Top-3) mit voller
Tiefe: Pricing-Modell, Monats-/Setup-Kosten, Time-to-Value, Integration in den
bestehenden Stack (PMS/POS/Channel/DATEV), Vendor-Compliance (EU-Hosting, AVV,
TSE, GoBD, AI-Act), Begründung gegen die Alternativen und Exit-Strategie.
Die Gesamt-Kosten (monatlich + Setup) werden deterministisch aus den
Empfehlungen aufsummiert — keine vom Modell geratenen Summen.
"""
from schemas.briefing import Briefing
from schemas.outputs import UseCaseOutput, ToolRecommendationOutput
from agents._client import call_agent
from knowledge import vendor_options_text


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior IT-Architect für Hospitality-Mittelstand DACH — Niveau eines BCG-Tech-Director oder Senior Solution-Architect einer Big-4-Hospitality-Practice. Du empfiehlst Tools, nicht Träume — mit VOLLER TIEFE pro Empfehlung.

ARBEITSWEISE — TOP-3 PRO USE-CASE (verbindlich):
- Pro Use-Case GENAU 1 Primärtool (primary_tool) + GENAU 2 echte Alternativen (alternative_tools) — also eine Top-3-Auswahl. Keine Stroh-Mann-Alternativen, sondern Tools, die ein Haus realistisch ebenfalls evaluieren würde.
- Differenziere nach Tier (Enterprise · SMB · Bootstrap) — passend zur Hausgröße. Kein Tier-Mismatch (kein Enterprise-Tool für ein Boutique-S-Haus).
- Pricing-Modell IMMER benennen (primary_tool_pricing_model): z.B. "pro Zimmer/Monat", "pro Nutzer/Monat", "Setup + Flat", "nutzungsbasiert".
- monthly_cost_eur + setup_cost_eur IMMER als realistische Zahl (kein 0, außer echtes Free-Tier — dann notes-fähig). Time-to-Value in Wochen (time_to_value_weeks) realistisch schätzen.
- EU-Hosting-Frage IMMER mitnehmen — bei US-Hosting AVV-Aufwand erwähnen.
- AI-Act-Risikoklasse pro Tool einschätzen (ai_act_class).
- Bei Kassen/POS: TSE-Zertifizierung nach KassenSichV ist Pflicht — tse_zertifiziert explizit setzen.
- Bei Buchhaltung: GoBD-Konformität (gobd_konform) + DATEV-Schnittstelle prüfen.
- Bei Telefonie/Voice: Hosting-Land, AVV, Audio-Recording-Hinweis (TKG/DSGVO).
- integration_with_existing + required_integrations konkret: welche Schnittstellen zum bestehenden Stack (PMS-API, POS-Anbindung, Channel-Manager-Webhook, DATEV-Export) sind nötig.
- Make-or-Buy-Logik: bei einfachen Workflows → Selbstbau (n8n + Claude) oft günstiger als SaaS-Stack.
- why_not_alternatives: knapp begründen, warum die 2 Alternativen NICHT die Erstwahl sind.
- exit_strategy: konkret beziffern (Kündigungsfrist, Datenexport-Format, Migrationsaufwand) — wie kommt das Haus wieder raus?

VENDOR-LANDSCHAFT 2026 (gefiltert auf Größe + Sub-Segment unten):
{vendor_blocks}

WAS DU NIE TUST:
- "Best of breed" als Floskel ohne zu erklären welches Breed
- Tools empfehlen, die du nicht zuordnen kannst
- Mehr als 8 Tools/Empfehlungen insgesamt (Empfehlungs-Inflation = nichts wird umgesetzt)
- Weniger oder mehr als 2 Alternativen pro Use-Case liefern
- Compliance-Block leer lassen — Hospitality-DACH ist regulierte Branche
- exit_strategy oder why_not_alternatives weglassen

OUTPUT — strikt JSON, ALLE Felder ausfüllen:

{
  "recommendations": [
    {
      "use_case_name": "Name exakt aus Use-Case-Output",
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
      "why_not_alternatives": "Knapper Vergleich: warum sind die 2 Alternativen NICHT die Erstwahl",
      "integration_with_existing": "Wie es mit dem bestehenden Stack (PMS/POS/Channel/Stb) zusammenspielt",
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

Hinweis: total_monthly_cost_eur und total_setup_cost_eur darfst du grob schätzen — sie werden danach exakt aus den Einzelposten neu berechnet. Konzentriere dich auf korrekte Einzelkosten.
"""


def _recompute_totals(output: ToolRecommendationOutput) -> ToolRecommendationOutput:
    """Summiert Monats- und Setup-Kosten deterministisch aus den Einzelposten.

    Überschreibt die vom Modell gelieferten Summen, damit die Totals immer exakt
    der Liste entsprechen (keine erfundenen/geratenen Aggregate). Jede Zahl
    stammt ausschließlich aus den monthly_cost_eur / setup_cost_eur der
    einzelnen Empfehlungen.
    """
    output.total_monthly_cost_eur = sum(r.monthly_cost_eur for r in output.recommendations)
    output.total_setup_cost_eur = sum(r.setup_cost_eur for r in output.recommendations)
    return output


def _normalise_alternatives(output: ToolRecommendationOutput) -> ToolRecommendationOutput:
    """Stellt sicher, dass jede Empfehlung GENAU 2 Alternativen führt (Top-3).

    Es werden keine Tool-Namen erfunden: zu lange Listen werden auf die ersten
    2 gekürzt; fehlende Slots werden mit einem expliziten Platzhalter-Hinweis
    aufgefüllt, der die Datenlücke transparent macht (statt eine Marke zu raten).
    """
    for r in output.recommendations:
        alts = [a for a in r.alternative_tools if a and a.strip()]
        if len(alts) > 2:
            alts = alts[:2]
        while len(alts) < 2:
            alts.append("(keine zweite Alternative im Knowledge-Pack belegt — vor Auswahl prüfen)")
        r.alternative_tools = alts
    return output


def run(briefing: Briefing, use_cases: UseCaseOutput) -> ToolRecommendationOutput:
    sub_segment_raw = (briefing.company.sub_segment or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique", "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel", "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb", "hotelgruppe": "boutique",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")

    categories = ["pms", "channel_manager", "booking_engine", "crm_guest", "reputation_management",
                  "chatbot", "hr_scheduling", "automation", "voice_ai"]
    vendor_text = "\n\n".join(vendor_options_text(c, sub_segment) for c in categories)

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{vendor_blocks}", vendor_text)

    user_message = f"""BRIEFING:
- Firma: {briefing.company.name}
- Größe: {briefing.company.size_class} · {briefing.company.employees} MA · {briefing.company.locations} Standorte
- Sub-Segment: {briefing.company.sub_segment}
- Aktueller Stack: {', '.join(briefing.current_tools)}

USE-CASES (zu jedem empfiehlst du Tools — Top-3: 1 Primärtool + 2 Alternativen):
{use_cases.model_dump_json(indent=2)}

Empfehle pro Use-Case 1 Primärtool + GENAU 2 echte Alternativen. Fülle Pricing-Modell, monthly_cost_eur, setup_cost_eur, time_to_value_weeks, integration_with_existing, required_integrations (PMS/POS/Channel/DATEV), den vollständigen Compliance-Block (EU-Hosting/AVV/TSE/GoBD/AI-Act), why_not_alternatives und exit_strategy für JEDE Empfehlung aus."""

    raw = call_agent(system, user_message)
    output = ToolRecommendationOutput.model_validate(raw)
    output = _normalise_alternatives(output)
    output = _recompute_totals(output)
    return output
