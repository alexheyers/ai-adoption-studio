"""Agent 05 · Compliance-Checker — Senior-Consultant-Niveau.

DSGVO + EU AI-Act + Branchen-spezifische Compliance-Hinweise.
Konkrete Mitigationen mit AVV-Klausel-Pointer + Risiko-Klassifikation.
KEINE Rechtsberatung — strukturierte Hinweise mit Disclaimer.

Architektur (zweischichtig — nachvollziehbar + testbar):

1. DETERMINISTISCHE HEURISTIK-SCHICHT (`classify_use_case`):
   Mappt `ai_pattern` + im Use-Case erkannte Datenkategorien → EU-AI-Act-Risikoklasse,
   DSGVO-Relevanz, branchenspezifische Pflichten (Gastrecht/Meldeschein, Hygiene/HACCP,
   KassenSichV/TSE, GoBD, Beschäftigtendatenschutz) und Baseline-Mitigationen.
   Diese Schicht ist reproduzierbar und ohne LLM lauffähig → bildet immer die Untergrenze.

2. LLM-SCHICHT (`call_agent`, wie die übrigen Agents):
   Verfeinert die Begründungen (dsgvo_reason, general_advice) in Senior-Consultant-Tonalität
   und ergänzt fallspezifische Mitigationen.

MERGE-REGEL: Die Risikoklasse wird auf das STRENGERE Ergebnis von Heuristik vs. LLM
gesetzt (AI-Act ist ein Floor, kein Ceiling). Fällt das LLM aus, liefert die Heuristik
allein einen vollständigen, validen Output.
"""
import json

from agents._client import call_agent
from schemas.briefing import Briefing
from schemas.outputs import (
    ComplianceFlag,
    ComplianceOutput,
    UseCase,
    UseCaseOutput,
    ToolRecommendation,
    ToolRecommendationOutput,
)
from knowledge import compliance


# ── EU-AI-Act-Risiko-Ordnung (für STRENGER-Merge) ──────────────────────────────
_RISK_ORDER = {"minimal": 0, "limited": 1, "high": 2, "unacceptable": 3}


def _stricter(a: str, b: str) -> str:
    """Gibt die strengere von zwei Risikoklassen zurück (AI-Act ist ein Floor)."""
    a = a if a in _RISK_ORDER else "minimal"
    b = b if b in _RISK_ORDER else "minimal"
    return a if _RISK_ORDER[a] >= _RISK_ORDER[b] else b


# ── Schlüsselwort-Lexika für Datenkategorie-Erkennung ──────────────────────────
# Strikt aus den Use-Case-Texten abgeleitet — keine erfundenen Annahmen.
_KW_PERSONAL = (
    "gast", "gäst", "kund", "reservier", "buchung", "check-in", "check in", "checkin",
    "meldeschein", "mail", "e-mail", "email", "kontakt", "telefon", "anruf", "voice",
    "newsletter", "crm", "stammgast", "loyalty", "bewertung", "review", "concierge",
    "chatbot", "personalisier", "adress", "name", "rechnung", "zahlung", "profil",
)
_KW_SENSITIVE = (
    "gesundheit", "spa", "wellness", "allergi", "kostform", "diät", "religi",
    "biometr", "gesicht", "selfie", "ausweis", "fingerabdruck",
)
_KW_EMPLOYEE = (
    "mitarbeiter", "personal", "dienstplan", "schicht", "recruit", "bewerb",
    "onboarding", "lohn", "gehalt", "leistungsbewertung", "performance", "schulung",
)
_KW_DECISION = (
    "screening", "auto-ablehn", "ablehnung", "kreditwürdig", "bonität", "scoring",
    "tier-einstufung", "beförder", "entscheidung über", "vorsortier", "auswahl",
)
_KW_EMOTION = ("emotion", "stimmung", "gefühlserkennung", "sentiment-kamera", "überwach")
_KW_SOCIAL_SCORE = ("social scoring", "social-scoring", "verhaltens-tier", "gäste-scoring", "gast-scoring")
# Branchen-Trigger
_KW_TSE = ("kasse", "pos", "tse", "f&b", "f & b", "restaurant", "bar ", "abrechnung", "trinkgeld")
_KW_GOBD = ("rechnung", "beleg", "buchhaltung", "datev", "archiv", "stb", "monatsabschluss", "reporting")
_KW_HYGIENE = ("haccp", "hygiene", "temperatur", "wareneingang", "küche", "kueche", "speise", "lebensmittel")
_KW_MELDE = ("meldeschein", "check-in", "check in", "checkin", "einchecken", "front-office", "front office")
_KW_GENERATIVE = ("generat", "schreib", "verfass", "antwort", "post", "text erstell", "content")
_KW_INTERACTIVE = ("chat", "voice", "concierge", "bot", "assistent", "gespräch", "dialog")


def _haystack(uc: UseCase) -> str:
    parts = [uc.name or "", uc.description or "", uc.target_process or "", uc.expected_impact or ""]
    return " ".join(parts).lower()


def _hits(text: str, keywords) -> bool:
    return any(k in text for k in keywords)


def _us_cloud_tool(uc_name: str, tools: list[ToolRecommendation]) -> ToolRecommendation | None:
    """Findet die Tool-Empfehlung zum Use-Case, wenn sie auf Nicht-EU-Hosting deutet."""
    for t in tools:
        if t.use_case_name != uc_name:
            continue
        country = (t.primary_tool_vendor_country or "").lower()
        eu_hosting = t.compliance.eu_hosting
        non_eu = eu_hosting is False or any(
            c in country for c in ("usa", "us", "vereinigte staaten", "united states", "uk", "vereinigtes")
        )
        if non_eu:
            return t
    return None


def classify_use_case(uc: UseCase, tools: list[ToolRecommendation]) -> dict:
    """Deterministische Heuristik-Schicht.

    Liefert ein Dict mit: dsgvo_relevant, dsgvo_reason (Heuristik-Baseline),
    ai_act_risk_class, industry_specific[], mitigations[].
    Reproduzierbar, ohne LLM-Aufruf — bildet die Untergrenze des finalen Flags.
    """
    text = _haystack(uc)
    pattern = uc.ai_pattern

    processes_personal = _hits(text, _KW_PERSONAL) or pattern in (
        "chatbot", "voice-agent", "rag", "classification", "generation", "agent", "prediction"
    )
    processes_sensitive = _hits(text, _KW_SENSITIVE)
    processes_employee = _hits(text, _KW_EMPLOYEE)
    is_decision = _hits(text, _KW_DECISION)
    is_emotion = _hits(text, _KW_EMOTION) and (processes_employee or "mitarbeiter" in text)
    is_social_score = _hits(text, _KW_SOCIAL_SCORE)
    is_interactive = _hits(text, _KW_INTERACTIVE) or pattern in ("chatbot", "voice-agent")
    is_generative = _hits(text, _KW_GENERATIVE) or pattern in ("generation", "rag", "chatbot", "voice-agent")
    is_biometric = any(k in text for k in ("biometr", "gesicht", "fingerabdruck")) and "verifik" not in text

    # ── AI-Act-Risikoklasse (Floor-Logik) ──────────────────────────────────────
    risk = "minimal"
    risk_reasons: list[str] = []

    if is_social_score:
        risk = "unacceptable"
        risk_reasons.append("Social Scoring von Gästen ist nach AI-Act verboten (Art. 5).")
    elif is_emotion:
        risk = "unacceptable"
        risk_reasons.append("Emotionserkennung am Arbeitsplatz ist nach AI-Act verboten (Art. 5).")

    if risk not in ("unacceptable",):
        # Hochrisiko: KI entscheidet über Personen (Beschäftigte / Bonität) ODER Biometrie
        if (processes_employee and is_decision) or (is_decision and any(
            k in text for k in ("kreditwürdig", "bonität", "scoring", "kredit")
        )):
            risk = _stricter(risk, "high")
            risk_reasons.append(
                "KI-gestützte Entscheidung über Personen (Beschäftigung/Bonität) → Hochrisiko Anhang III."
            )
        elif is_biometric:
            risk = _stricter(risk, "high")
            risk_reasons.append("Biometrische Identifikation → Hochrisiko (reine Selfie-Ausweis-Verifikation wäre limited).")
        elif is_interactive or is_generative:
            risk = _stricter(risk, "limited")
            risk_reasons.append("Generatives/interaktives KI-System mit Personenkontakt → Transparenz-Pflicht Art. 50.")

    if not risk_reasons:
        risk_reasons.append("Standard-Automation ohne direkte Personen-Entscheidung → minimales AI-Act-Risiko.")

    # ── DSGVO-Relevanz ─────────────────────────────────────────────────────────
    dsgvo_relevant = bool(processes_personal or processes_sensitive or processes_employee)
    dsgvo_parts: list[str] = []
    if processes_sensitive:
        dsgvo_parts.append(
            "Verarbeitet besondere Kategorien (Art. 9, z.B. Gesundheit/Spa) → Einwilligung + DSFA-Pflicht."
        )
    elif processes_employee:
        dsgvo_parts.append(
            "Beschäftigtendaten (§ 26 BDSG) → Rechtsgrundlage + ggf. Betriebsrats-Mitbestimmung."
        )
    elif processes_personal:
        if any(k in text for k in ("reservier", "buchung", "check-in", "rechnung")):
            dsgvo_parts.append("Gästedaten zur Vertragserfüllung (Art. 6 Abs. 1 lit. b) → AVV mit allen Verarbeitern.")
        elif any(k in text for k in ("newsletter", "marketing", "personalisier")):
            dsgvo_parts.append("Marketing/Profiling → Einwilligung bzw. berechtigtes Interesse + Opt-out (Art. 6 lit. a/f).")
        else:
            dsgvo_parts.append("Personenbezogene Gästedaten → Rechtsgrundlage feststellen + AVV abschließen.")
    else:
        dsgvo_parts.append("Keine personenbezogenen Daten erkennbar → DSGVO nachrangig, AI-Act dennoch prüfen.")

    us_tool = _us_cloud_tool(uc.name, tools)
    if us_tool and dsgvo_relevant:
        dsgvo_parts.append(
            f"Drittlandtransfer über {us_tool.primary_tool} ({us_tool.primary_tool_vendor_country or 'Nicht-EU'}) → SCC + TIA nötig."
        )

    # ── Branchenspezifische Pflichten ──────────────────────────────────────────
    industry: list[str] = []
    if _hits(text, _KW_MELDE):
        industry.append("Gastrecht/BMG: Meldescheinpflicht §§ 29-31, Aufbewahrung 1 Jahr, Verarbeitung nur EU/EWR.")
    if _hits(text, _KW_TSE):
        industry.append("KassenSichV/TSE: elektronische Kasse braucht zertifizierte TSE (DSFinV-K 2.4), Cloud-TSE zulässig.")
    if _hits(text, _KW_GOBD):
        industry.append("GoBD/§ 147 AO: Belege revisionssicher + unveränderbar 10 Jahre archivieren (DATEV-Export-Pfad sichern).")
    if _hits(text, _KW_HYGIENE):
        industry.append("HACCP: Temperatur-/Reinigungs-/Schulungs-Protokolle sind digital zulässig, müssen aber revisionssicher sein.")
    if processes_employee:
        industry.append("Beschäftigtendatenschutz: § 26 BDSG + Betriebsrat-Mitbestimmung (§ 87 BetrVG) bei Leistungs-/Verhaltenskontrolle.")
    if any(k in text for k in ("bar", "geld", "10.000", "10000")) and "geldwäsch" in text:
        industry.append("GwG: Barzahlungen ab 10.000 EUR → Identifikation + Aufzeichnung + Verdachtsmeldung.")
    industry = industry[:3]

    # ── Baseline-Mitigationen ──────────────────────────────────────────────────
    mitigations: list[str] = []
    if dsgvo_relevant:
        mitigations.append("AVV (Art. 28 DSGVO) mit jedem Verarbeiter abschließen (PMS, Channel, LLM-Anbieter).")
    if risk == "limited":
        mitigations.append('Transparenz-Hinweis ergänzen: "Diese Antwort wurde mit KI-Unterstützung erstellt."')
    if risk == "high":
        mitigations.append("Mensch-in-der-Loop verpflichtend — finale Entscheidung nie automatisiert (Art. 14); KI nur Vorsortierung.")
        mitigations.append("Risikomanagement + Logging + Bias-Tests (Art. 9-15) dokumentieren, EU-AI-Datenbank-Registrierung prüfen.")
    if risk == "unacceptable":
        mitigations = ["Use-Case NICHT umsetzen — nach AI-Act Art. 5 verboten; ggf. konformes Re-Design ohne verbotenes Element."]
    if processes_sensitive:
        mitigations.append("DSFA durchführen + Einwilligung einholen, bevor sensible Daten (Gesundheit/Spa) verarbeitet werden.")
    if us_tool:
        mitigations.append(f"Drittland: SCC + Transfer-Impact-Assessment für {us_tool.primary_tool}, EU-Hosting-Alternative prüfen.")
    if not mitigations:
        mitigations.append("DSGVO-Beauftragten einbinden + Verarbeitungsverzeichnis (Art. 30) ergänzen.")
    mitigations = mitigations[:4]

    return {
        "use_case_name": uc.name,
        "dsgvo_relevant": dsgvo_relevant,
        "dsgvo_reason": " ".join(dsgvo_parts)[:400],
        "ai_act_risk_class": risk,
        "ai_act_reason": " ".join(risk_reasons),
        "industry_specific": industry,
        "mitigations": mitigations,
    }


SYSTEM_PROMPT_TEMPLATE = """Du bist Senior Compliance-Director mit Schwerpunkt EU-Datenschutz (DSGVO), EU-AI-Act und deutsches Hospitality-Recht — vergleichbar mit einem Senior-Partner einer Wirtschaftsprüfer-Kanzlei mit Tech-Compliance-Praxis (z.B. Taylor Wessing, CMS, Hengeler Mueller).

Du bekommst KI-Use-Cases + Tool-Empfehlungen UND eine bereits berechnete deterministische Vorklassifikation (Heuristik). Deine Aufgabe: die Vorklassifikation in Senior-Consultant-Sprache veredeln — fundierte dsgvo_reason, präzise industry_specific-Punkte, konkrete mitigations, klares general_advice. Du darfst die Risikoklasse VERSCHÄRFEN, wenn juristisch geboten, aber NIE abschwächen.

Pro Use-Case lieferst du:
1. DSGVO-Relevanz (ja/nein) + Rechtsgrundlage (Art. 6 DSGVO) + Auslandstransfer-Hinweis
2. EU AI-Act Risikoklasse: minimal | limited | high | unacceptable
3. Branchen-spezifische Hinweise (Meldescheinpflicht/BMG, KassenSichV/TSE, GoBD, HACCP, Beschäftigtendatenschutz, GwG)
4. Konkrete Mitigationen (AVV-Klauseln, Transparenz-Hinweise, Mensch-in-der-Loop, DSFA-Pflicht, SCC+TIA bei US-Cloud)

DEINE INFO-BASIS (verwende strikt diese, nicht halluzinieren):

DSGVO-Regelwerk:
{dsgvo_block}

AI-Act-Klassifikation:
{ai_act_block}

Branchen-spezifische Pflichten:
{hospitality_block}

REGELN:
- LÄNGE: dsgvo_reason max 2 Sätze. industry_specific max 3 Bullet-Points, je max 1 Satz. mitigations max 4 Bullet-Points, je max 1 Satz. general_advice max 3 Sätze.
- KEINE Rechtsberatung — strukturierte Hinweise mit Disclaimer.
- Risikoklasse NIE unter die Heuristik-Vorgabe senken — nur halten oder verschärfen.
- Bei Auslandstransfer (US-Cloud): SCC + TIA erwähnen.
- Bei Recruiting-/HR-KI: AI-Act-Hochrisiko warning + Mensch-in-Loop-Pflicht.
- Bei generativen Chatbots: Transparenz-Pflicht (Art. 50 AI-Act).
- Bei Mitarbeiter-Daten: Betriebsrat-Themen erwähnen wenn relevant.
- use_case_name EXAKT aus dem Input übernehmen.

OUTPUT — strikt JSON:

{
  "flags": [
    {
      "use_case_name": "exakt aus Input",
      "dsgvo_relevant": true,
      "dsgvo_reason": "max 2 Sätze",
      "ai_act_risk_class": "minimal",
      "industry_specific": ["max 3 Bullets je 1 Satz"],
      "mitigations": ["max 4 Bullets je 1 Satz"]
    }
  ],
  "general_advice": "max 3 Sätze: was generell für DIESES Haus gilt — DSGVO-Beauftragter, AVVs mit Anbietern, Transparenz-Hinweise im Online-Flow."
}
"""


def _heuristic_general_advice(briefing: Briefing, flags: list[ComplianceFlag]) -> str:
    """Deterministischer Fallback für general_advice — falls LLM ausfällt."""
    name = briefing.company.name
    high = sum(1 for f in flags if f.ai_act_risk_class in ("high", "unacceptable"))
    dsgvo = sum(1 for f in flags if f.dsgvo_relevant)
    parts = [
        f"{name} sollte vor dem ersten KI-Rollout einen AVV (Art. 28 DSGVO) mit jedem Anbieter schließen "
        f"({dsgvo} der Use-Cases sind DSGVO-relevant) und das Verarbeitungsverzeichnis (Art. 30) ergänzen."
    ]
    parts.append(
        "Generative Gäste-Kontakte brauchen einen sichtbaren KI-Transparenz-Hinweis im Online-Flow (Art. 50 AI-Act)."
    )
    if high:
        parts.append(
            f"{high} Use-Case(s) berühren Hochrisiko-/verbotene Felder — diese erst nach Rechts-Klärung und mit Mensch-in-der-Loop angehen."
        )
    else:
        parts.append("Einen DSGVO-Beauftragten früh einbinden und die Datenflüsse je Tool dokumentieren.")
    return " ".join(parts[:3])


def run(
    briefing: Briefing,
    use_cases: UseCaseOutput,
    tools: ToolRecommendationOutput,
) -> ComplianceOutput:
    tool_list = list(tools.recommendations)

    # ── Schicht 1: deterministische Heuristik pro Use-Case ─────────────────────
    heuristic = {uc.name: classify_use_case(uc, tool_list) for uc in use_cases.use_cases}

    # ── Knowledge-Blöcke für den LLM-Prompt ────────────────────────────────────
    cp = compliance()
    dsgvo_block = json.dumps(cp.get("dsgvo", {}).get("general", {}), ensure_ascii=False)[:1800]
    ai_act_block = json.dumps(cp.get("ai_act", {}).get("risikoklassen_hospitality", {}), ensure_ascii=False)[:2000]
    hospitality_block = json.dumps({
        "hospitality_dsgvo": cp.get("dsgvo", {}).get("hospitality_specific", {}),
        "gwg": cp.get("gwg_geldwäsche", {}),
        "steuer": cp.get("steuer_compliance", {}),
        "hygiene": cp.get("hygiene", {}),
        "anti_patterns": cp.get("ai_act", {}).get("hospitality_specific_anti_patterns", []),
    }, ensure_ascii=False)[:1500]

    system = SYSTEM_PROMPT_TEMPLATE
    system = system.replace("{dsgvo_block}", dsgvo_block)
    system = system.replace("{ai_act_block}", ai_act_block)
    system = system.replace("{hospitality_block}", hospitality_block)

    user_message = json.dumps({
        "company": {
            "name": briefing.company.name,
            "sub_segment": briefing.company.sub_segment,
            "size_class": briefing.company.size_class,
            "region": briefing.company.region,
        },
        "use_cases": [
            {
                "name": u.name,
                "description": u.description,
                "target_process": u.target_process,
                "ai_pattern": u.ai_pattern,
                "expected_impact": u.expected_impact,
            }
            for u in use_cases.use_cases
        ],
        "tools": [
            {
                "use_case_name": t.use_case_name,
                "primary_tool": t.primary_tool,
                "vendor_country": t.primary_tool_vendor_country,
                "eu_hosting": t.compliance.eu_hosting,
                "ai_act_class": t.compliance.ai_act_class,
            }
            for t in tool_list
        ],
        "heuristik_vorklassifikation": list(heuristic.values()),
    }, ensure_ascii=False)

    # ── Schicht 2: LLM-Veredelung (robust gegen Ausfall) ───────────────────────
    raw_flags: dict[str, dict] = {}
    llm_general_advice = ""
    try:
        raw = call_agent(system, user_message)
        for f in raw.get("flags", []):
            n = f.get("use_case_name")
            if n:
                raw_flags[n] = f
        llm_general_advice = (raw.get("general_advice") or "").strip()
    except Exception:
        # LLM nicht erreichbar / nicht-parsbar → reiner Heuristik-Output bleibt valide.
        raw_flags = {}

    # ── Merge: Heuristik = Floor, LLM = Veredelung ─────────────────────────────
    flags: list[ComplianceFlag] = []
    for uc in use_cases.use_cases:
        h = heuristic[uc.name]
        llm = raw_flags.get(uc.name, {})

        # Risikoklasse: strengeres von Heuristik vs. LLM (AI-Act ist Floor).
        risk = _stricter(h["ai_act_risk_class"], llm.get("ai_act_risk_class", "minimal"))

        # DSGVO-Relevanz: True, sobald eine der Schichten True sagt.
        dsgvo_relevant = bool(h["dsgvo_relevant"] or llm.get("dsgvo_relevant", False))

        # Begründung: LLM bevorzugt (Tonalität), sonst Heuristik-Baseline.
        dsgvo_reason = (llm.get("dsgvo_reason") or "").strip() or h["dsgvo_reason"]

        # Listen: LLM-Inhalte bevorzugt, fehlende durch Heuristik aufgefüllt (dedupliziert).
        def _merge_list(primary, fallback, limit):
            seen, out = set(), []
            for item in list(primary or []) + list(fallback or []):
                key = (item or "").strip().lower()
                if key and key not in seen:
                    seen.add(key)
                    out.append(item.strip())
                if len(out) >= limit:
                    break
            return out

        industry = _merge_list(llm.get("industry_specific"), h["industry_specific"], 3)
        mitigations = _merge_list(llm.get("mitigations"), h["mitigations"], 4)

        flags.append(ComplianceFlag(
            use_case_name=uc.name,
            dsgvo_relevant=dsgvo_relevant,
            dsgvo_reason=dsgvo_reason or None,
            ai_act_risk_class=risk,
            industry_specific=industry,
            mitigations=mitigations,
        ))

    general_advice = llm_general_advice or _heuristic_general_advice(briefing, flags)

    return ComplianceOutput(
        flags=flags,
        general_advice=general_advice,
        # disclaimer behält den Schema-Default (Rechtsberatungs-Hinweis).
    )
