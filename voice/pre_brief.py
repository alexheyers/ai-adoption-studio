"""Pre-Brief-Builder · Senior-Consultant-Niveau.

Erzeugt System-Prompt + Initial-Context für Ada (ElevenLabs Conversational AI).
Strategie:
  1. Pre-Audit-Analyst hat bereits 5-7 Hypothesen generiert (BEVOR Ada spricht)
  2. Pre-Brief enthält diese Hypothesen als Kern des Gesprächs
  3. Plus passende Hypothesen-Bäume aus hypothesis_trees.yaml für Tiefe
  4. Ada arbeitet hypothesen-getrieben durch — nicht linear Fragen-abhaken

Ada ist Senior-Consultant — konfrontiert höflich, quantifiziert live, vergleicht
gegen Branchen-Benchmarks (die im System-Prompt verfügbar sind).
"""
from pathlib import Path
import yaml

from voice.pool_loader import select_questions  # noch da für Fallback
from knowledge import benchmarks_summary_text, trends_summary_text


TREES_PATH = Path(__file__).parent / "hypothesis_trees.yaml"


def load_trees() -> list[dict]:
    with TREES_PATH.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("trees", [])


ADA_PERSONA = """Du bist Ada — Senior-Consultant für KI-Adoption im Hospitality-Mittelstand, vergleichbar mit einem Director einer Top-Beratung (Horwath HTL, BDO Hospitality, oder einer der vier großen Wirtschaftsprüfer mit Hospitality-Praxis). 15 Jahre Branchen-Erfahrung. Du sprichst Deutsch in natürlichem, gesprochenem Stil. Du bist KEIN Fragebogen-Bot.

DEIN GESPRÄCHS-FLOW (~30-40 Min):

PHASE 1 (Min 0-1) — BEGRÜSSUNG:
Du begrüßt den Gesprächspartner mit Vornamen, kurz freundlich. Beispiel: "Hallo {name}, schön dass Sie sich Zeit nehmen. Wir haben 30 bis 40 Minuten miteinander."

PHASE 2 (Min 1-5) — DATEN-RECAP (NUR wenn Dokumente hochgeladen wurden):
"Bevor wir ins Gespräch gehen, möchte ich kurz mit Ihnen über das reden, was ich aus Ihren Unterlagen gelesen habe."
Dann Recap aus dem 'data_recap_for_voice'-Feld vorlesen — natürlich, gesprochen, mit den konkreten Zahlen. Am Ende: "Stimmt das Bild aus Ihrer Sicht, oder übersehe ich etwas Wichtiges?"

PHASE 2-Alt (wenn KEINE Dokumente): Direkt zur Eröffnungs-Hypothese überleiten.

PHASE 3 (Min 5-30) — HYPOTHESEN-VALIDIERUNG IN DER TIEFE:
Arbeite jetzt die Hypothesen-Ketten ab — 5-7 Themen-Blöcke à 3-5 Minuten. Pro Hypothese:
- Stelle die Push-Back-Frage konkret und konfrontativ-höflich
- Hör zu, fasse kurz zusammen, frage nach konkreten Zahlen
- Geh in die Folgefragen (mind. 3-5 pro Thema)
- Vergleich live mit Branchen-Benchmarks (siehe unten)
- Quantifiziere den Hebel auf der Stelle
- Wenn die Hypothese durch die Antworten widerlegt wird, sag das offen: "OK, dann war meine Annahme falsch — was ist statt dessen die Realität?"

PHASE 3-Querrecherche (parallel): Frage systematisch nach ALLEN digitalisierbaren Hotel-Bereichen — nicht nur Front-Office. Decke ab:
- Front-Office (Reservation, Check-in, Mail, Voice)
- Housekeeping
- F&B Service + Küche
- Wellness/Spa
- MICE / Veranstaltungen
- Marketing + CRM
- BESCHAFFUNG & EINKAUF (Lieferanten, Bestellung, Wareneinsatz, Inventar)
- BUCHHALTUNG / VERWALTUNG (Rechnungseingang, Lohn, Reporting, Steuer)
- GEBÄUDEMANAGEMENT (Wartung, Reparatur, Energie, Smart-Building)
- PERSONAL (Recruiting, Dienstplan, Onboarding, Schulung)
- IT-Infrastruktur (Backup, Sicherheit, Schnittstellen, WLAN)
- COMPLIANCE / Reporting-Pflichten (Meldescheine, DSGVO, AI-Act, Hygiene)

Pro Domain mindestens eine konkrete Frage: "Wie machen Sie das heute, mit welchem Tool, wie viel Aufwand pro Woche?" — damit das Multi-Agent-System hinterher das volle Inventar hat.

PHASE 4 (Min 30-35) — SYNTHESE:
"Lassen Sie mich kurz zusammenfassen was ich gehört habe..." Working-Hypothesis nennen. "Mein Eindruck: das Hauptproblem ist nicht X, sondern Y. Stimmt das mit Ihrem Bauchgefühl?"

PHASE 5 (Min 35-40) — ABSCHLUSS:
"Wir lassen das Gespräch jetzt durch unser Multi-Agent-System laufen — Sie bekommen einen ausführlichen Bericht mit Empfehlungen, ROI-Modell, Tool-Stack und einer 12-Monats-Roadmap. Eine Frage zum Schluss: gibt es etwas, das ich nicht gefragt habe, das Sie aber unbedingt im Bericht sehen wollen?"

DU KONFRONTIERST HÖFLICH-ABER-BESTIMMT:
- Wenn Daten und Aussagen widersprechen: "Sie sagen X. Die Zahlen aus Ihrer Excel legen aber Y nahe. Was übersehe ich?"
- Du nennst Branchen-Benchmarks: "p50 in Ihrer Größenklasse ist Z — Sie liegen bei W. Was ist die Ursache?"
- Branchen-Vergleiche: "Drei Boutique-Häuser Ihrer Größenklasse haben das gelöst durch..."

DU QUANTIFIZIERST LIVE:
- "Wenn das stimmt, ist der Hebel ~X EUR/Jahr"
- Frag nach Zahlen: "Wie viele Anfragen pro Monat? Wie viele Buchungen? Durchschnittlicher Buchungswert?"

WAS DU NIE TUST:
- Buzzword-Bingo ("disruptiv", "next-level", "game-changer")
- Heilsversprechen ("KI löst alle Probleme")
- Lange Monologe außer in Phase 2 (Daten-Recap) und Phase 4 (Synthese)
- Generische Beratungs-Floskeln
- Rechtsberatung
- Person bewerten ("toll dass Sie...")

WAS DU IMMER TUST:
- Vornamen verwenden wenn bekannt
- Hypothese explizit machen: "Meine Vermutung war X — bestätigt sich das?"
- Zwischen Themen überleiten: "Lassen Sie uns zu einem anderen Bereich..."
- Sprache: klar, präzise, natürlich gesprochen, kein Behörden-Deutsch
- Tief gehen statt breit abhaken — lieber 7 Themen mit je 4-5 Folgefragen als 13 Themen oberflächlich"""


def _trigger_matches(trigger_str: str, ctx: dict) -> bool:
    """Sehr einfache Trigger-Eval. Real-Implementation könnte hier eine kleine Expr-Sprache nutzen."""
    if not trigger_str:
        return False
    t = trigger_str.strip()
    if t.startswith("always"):
        return True
    # KPI-Vergleiche grob
    kpis = ctx.get("kpis", {})
    pains = " ".join(p.get("description", "") for p in (ctx.get("pain_points") or [])).lower()
    for k, v in kpis.items():
        if v is None:
            continue
        try:
            v = float(v)
        except Exception:
            continue
        if k in t:
            return True
    if "ota" in t.lower() and "ota" in pains:
        return True
    if "personal" in t.lower() and any(w in pains for w in ["personal", "fluktuation", "recruiting"]):
        return True
    if "review" in t.lower() and any(w in pains for w in ["bewertung", "review", "google"]):
        return True
    return False


def select_relevant_trees(company: dict, hypotheses: list[dict], max_trees: int = 15) -> list[dict]:
    """Wählt die Hypothesen-Bäume die zum Kontext passen — breit für vollständige Domain-Coverage.

    Erhöhte Cap auf 15 Trees (war 8): wir wollen die Querrecherche über alle Hotel-Bereiche,
    nicht nur Front-Office. Pro Category max 2 Trees, sodass keine Domain überrepräsentiert ist.
    """
    trees = load_trees()
    ctx = {
        "kpis": company.get("kpis") or {},
        "pain_points": company.get("pain_points") or [],
        "sub_segment": company.get("sub_segment"),
        "size_class": company.get("size_class"),
        "current_tools": company.get("current_tools") or [],
    }

    selected = []
    cats_count = {}
    # Phase 1: Trigger-matched Trees
    for tr in trees:
        triggers = tr.get("trigger") or []
        if any(_trigger_matches(t, ctx) for t in triggers):
            cat = tr.get("category", "")
            if cats_count.get(cat, 0) < 2:
                selected.append(tr)
                cats_count[cat] = cats_count.get(cat, 0) + 1
        if len(selected) >= max_trees:
            break

    # Phase 2: Domain-Coverage erzwingen — stelle sicher, dass alle wichtigen Domains
    # mindestens einmal vertreten sind (Beschaffung, Verwaltung, Gebäude, IT, Reporting, etc.)
    mandatory_categories = [
        "Beschaffung", "Verwaltung", "Gebäude", "IT", "Reporting",
        "Marketing", "Housekeeping", "MICE", "F&B",
    ]
    for cat_required in mandatory_categories:
        if cats_count.get(cat_required, 0) == 0:
            for tr in trees:
                if tr.get("category") == cat_required and tr.get("id") not in [s.get("id") for s in selected]:
                    selected.append(tr)
                    cats_count[cat_required] = 1
                    break
        if len(selected) >= max_trees:
            break

    # Phase 3: Fallback — Always-Trees auffüllen
    if len(selected) < 8:
        for tr in trees:
            if tr.get("id") not in [s.get("id") for s in selected]:
                if any("always" in (t or "") for t in (tr.get("trigger") or [])):
                    selected.append(tr)
                    if len(selected) >= max_trees:
                        break

    return selected[:max_trees]


def build_pre_brief(
    profile: dict,
    company: dict,
    web_research: dict | None = None,
    pre_audit: dict | None = None,
) -> tuple[dict, list[dict]]:
    """Returnt (pre_brief_dict, selected_trees).

    pre_audit ist optional — wenn vorhanden, werden die Hypothesen in den Prompt integriert.
    """
    user_name = (profile or {}).get("full_name") or "Sie"
    company_name = company.get("name") or "Ihr Haus"

    # Hypothesen-Bäume passend zum Kontext
    selected_trees = select_relevant_trees(company, hypotheses=(pre_audit or {}).get("hypotheses", []), max_trees=8)

    # Benchmarks für den Branchen-Vergleich
    sub_segment_raw = (company.get("sub_segment") or "boutique").lower()
    sub_segment_map = {
        "boutique-hotel": "boutique", "boutique": "boutique", "stadthotel": "stadthotel",
        "ferienhotel": "ferienhotel", "tagungshotel": "tagungshotel", "resort": "resort",
        "familienbetrieb": "familienbetrieb",
    }
    sub_segment = sub_segment_map.get(sub_segment_raw, "boutique")
    bench_text = benchmarks_summary_text(sub_segment, company.get("size_class") or "M")
    trends_text = trends_summary_text(max_items=4)

    # Pain Points
    pain_summary = "; ".join(
        p.get("description", "")[:120] for p in (company.get("pain_points") or []) if p.get("description")
    ) or "Keine spezifischen Pain Points im Onboarding genannt."

    # Web-Research
    web_summary = ""
    if web_research:
        findings = web_research.get("company_findings") or {}
        benchmarks = web_research.get("region_benchmarks") or {}
        if findings or benchmarks:
            web_summary = (
                f"\nWeb-Research zur Firma: {str(findings)[:500]}.\n"
                f"Region-Benchmarks: {str(benchmarks)[:500]}."
            )

    # Pre-Audit-Hypothesen
    hypothesis_text = ""
    if pre_audit and pre_audit.get("hypotheses"):
        hypothesis_text = "\n\n────────────────────────────\nDEINE VOR-ANALYSE-HYPOTHESEN (arbeite sie strukturiert ab):\n"
        for i, h in enumerate(pre_audit["hypotheses"], 1):
            hypothesis_text += (
                f"\n{i}. {h.get('title')} (Confidence: {h.get('confidence')})\n"
                f"   Hypothese: {h.get('statement')}\n"
                f"   Evidenz: {' | '.join(h.get('evidence', []))}\n"
                f"   Push-Back-Frage: {h.get('push_back_question')}\n"
                f"   Quantifizierung: {h.get('quantification_formula','—')}\n"
            )
        if pre_audit.get("overall_situation"):
            hypothesis_text += f"\nGesamt-Einschätzung VOR Gespräch: {pre_audit['overall_situation']}\n"
        if pre_audit.get("suggested_focus_topics"):
            hypothesis_text += "FOKUS-THEMEN (hier tief gehen): " + " | ".join(pre_audit["suggested_focus_topics"]) + "\n"
        if pre_audit.get("data_gaps"):
            hypothesis_text += "DATEN-LÜCKEN (hier nachfragen): " + " | ".join(pre_audit["data_gaps"]) + "\n"

    # Hypothesen-Bäume für Tiefe
    trees_text = "\n\n────────────────────────────\nDEINE HYPOTHESEN-BÄUME (Tiefe-Werkzeuge — nutze sie passend, nicht linear):\n"
    for tr in selected_trees:
        trees_text += (
            f"\n[{tr.get('id')}] {tr.get('category')} · {tr.get('root_question')}\n"
            f"  Folgefragen: " + " // ".join(tr.get("follow_ups", [])[:3]) + "\n"
            f"  Push-Back: {tr.get('push_back')}\n"
            f"  Exit: {tr.get('exit_criteria')}\n"
        )

    # System-Prompt zusammenbauen
    system_prompt = f"""{ADA_PERSONA}

────────────────────────────
KONTEXT — was du über den Gesprächspartner weißt:

Person: {user_name}
Firma: {company_name}
Branche: Hospitality / {company.get('sub_segment') or 'unbekannt'}
Größe: {company.get('size_class') or '?'} ({company.get('employees') or '?'} Mitarbeitende, {company.get('locations') or '?'} Standort(e))
Region: {company.get('region') or '-'}
Jahresumsatz: {company.get('annual_revenue_eur') or '-'} EUR
Aktuell genutzte Tools: {', '.join(company.get('current_tools') or []) or 'unbekannt'}

Pain Points aus dem Onboarding: {pain_summary}

{web_summary}

────────────────────────────
{bench_text}

────────────────────────────
{trends_text}
{hypothesis_text}
{trees_text}

────────────────────────────
ABLAUF DES GESPRÄCHS:

Minute 0-2: Begrüße {user_name} mit Vornamen, kurze Eröffnung. Steig direkt mit der wichtigsten Hypothese ein (höchster Confidence) — die Push-Back-Frage stellst du als Einstiegs-Frage.

Minute 2-25: Arbeite Hypothesen 1-5 ab. Pro Hypothese 3-7 Minuten — geh in die Tiefe, frag konkrete Zahlen, vergleiche gegen Benchmarks, push back wenn die Antwort nicht zu den Daten passt. Wenn eine Hypothese widerlegt ist, sag das offen ("OK, dann war meine Annahme falsch — was ist statt dessen die Realität?").

Minute 25-28: Working-Hypothesis-Synthese — "Mein Eindruck ist, das Hauptproblem ist NICHT X, sondern Y. Stimmt das mit Ihrem Bauchgefühl?"

Minute 28-30: Bedanken, klar erklären was als nächstes passiert (Multi-Agent-System läuft, Report in 24h).

WICHTIG: Du redest nicht über deine eigenen Hypothesen explizit. Du nutzt sie als interne Leitlinie. Der Gesprächspartner soll das Gefühl haben, dass du wirklich zuhörst — nicht dass du eine Checkliste abarbeitest.
"""

    # First-Message dynamisch: Begrüßung + optional Daten-Recap-Eröffnung
    data_recap = (pre_audit or {}).get("data_recap_for_voice", "") if pre_audit else ""
    if data_recap and len(data_recap) > 50:
        first_message = (
            f"Hallo {user_name.split(' ')[0] if user_name and user_name != 'Sie' else 'und herzlich willkommen'}, "
            f"schön dass Sie sich Zeit nehmen. Wir haben dreißig bis vierzig Minuten miteinander. "
            f"Bevor wir richtig ins Gespräch gehen, möchte ich kurz mit Ihnen über das reden, was ich aus Ihren hochgeladenen Unterlagen gelesen habe. "
            f"{data_recap}"
        )
    else:
        first_message = (
            f"Hallo {user_name.split(' ')[0] if user_name and user_name != 'Sie' else 'und herzlich willkommen'}, "
            f"schön dass Sie sich Zeit nehmen. Wir haben dreißig bis vierzig Minuten miteinander. "
            f"Erzählen Sie mir doch zum Einstieg ganz kurz: wie würden Sie {company_name} in einem Satz positionieren — "
            f"was unterscheidet Sie wirklich von der Konkurrenz drei Straßen weiter?"
        )

    pre_brief = {
        "system_prompt": system_prompt,
        "user_name": user_name,
        "company_name": company_name,
        "selected_tree_ids": [t["id"] for t in selected_trees],
        "duration_target_minutes": 35,
        "hypotheses_count": len((pre_audit or {}).get("hypotheses", [])),
        "first_message": first_message,
        "has_data_recap": bool(data_recap and len(data_recap) > 50),
    }
    # selected_questions als kompakter Subset für UI-Anzeige (legacy)
    selected_questions = [
        {"id": t["id"], "category": t.get("category", ""), "question": t.get("root_question", "")}
        for t in selected_trees
    ]
    return pre_brief, selected_questions
