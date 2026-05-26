# agent_patterns — SDK-Architektur

> Neue, wiederverwendbare Agent-Library auf dem **Claude Agent SDK**
> (`claude-agent-sdk`, Anthropic). Additiv aufgebaut — der bestehende
> FastAPI-/`agents/`-Code bleibt **unverändert**. Diese Library ist das
> Fundament, auf das die Pipeline schrittweise migriert werden kann.

---

## 1. Warum diese Library?

Der heutige Stand (`agents/*.py` + `runs/pipeline_runner.py`) funktioniert, ist
aber an mehreren Stellen hart verdrahtet:

- Jeder Agent ruft den **rohen** `anthropic`-Client (`agents/_client.call_agent`) direkt.
- Reihenfolge, Pausen und welche Agenten laufen, stehen **im Python-Code** (`agents/orchestrator.py`).
- Tools (Web-Search, Knowledge-Zugriff) sind pro Agent von Hand eingebaut.

`agent_patterns/` dreht das um:

- **Config-driven:** Welche Agenten, in welcher Reihenfolge, mit welcher Pause → `config/config.yaml`.
- **Reusable:** Ein Agent ist ein deklarativer `AgentSpec` (Prompt + Output-Modell + Message-Builder), kein vererbter Klassen-Baum.
- **SDK-basiert:** Alle Agenten laufen über den `claude-agent-sdk`-`query()`-Loop → einheitliche Tool-/Permission-/MCP-Schicht, gleiche Abstraktion wie Claude Code selbst.

---

## 2. Voraussetzungen

```bash
# NUR ins lokale venv installieren — Repo-requirements.txt bleibt unangetastet
.venv/bin/pip install -r agent_patterns/requirements.txt
```

`claude-agent-sdk` benötigt zur Laufzeit **eines** von beidem:

1. Die **Claude Code CLI** auf dem System (`npm i -g @anthropic-ai/claude-code`), die der SDK-`query()` im Hintergrund nutzt, **oder**
2. Einen gesetzten `ANTHROPIC_API_KEY` (in `.env`, wird über `python-dotenv` geladen — wie im bestehenden `config.py`).

Ohne SDK bricht der erste Lauf mit einem **klaren Install-Hinweis** ab; der
Import des Pakets selbst funktioniert weiter (Config-Layer ist SDK-frei testbar).

---

## 3. Paket-Struktur

```
agent_patterns/
├── __init__.py              # Public API: AgentSpec, SdkAgent, Orchestrator, PatternConfig
├── requirements.txt         # nur claude-agent-sdk (additiv zum Repo-requirements.txt)
├── example_run.py           # lauffähiges Demo mit mock_data/demo_hotel.json
├── core/
│   ├── __init__.py
│   ├── base_agent.py        # AgentSpec + SdkAgent + JSON-Extraktion (SDK-Wrapper)
│   └── orchestrator.py      # config-getriebener serieller Runner
├── tools/
│   ├── __init__.py
│   └── knowledge_tool.py    # read-only Zugriff aufs bestehende knowledge/-Pack
├── config/
│   ├── __init__.py          # Pfad-Helfer (DEFAULT_CONFIG_PATH)
│   └── config.yaml          # welche Agenten / Reihenfolge / Pause
└── patterns/
    ├── __init__.py
    └── ai_adoption/         # erstes konkretes Pattern (Hospitality)
        ├── __init__.py      # REGISTRY: name -> AgentSpec-Factory
        ├── process_auditor.py    # migriert von agents/process_auditor.py
        └── document_analyst.py   # migriert von agents/document_analyst.py
```

---

## 4. Die drei Kern-Bausteine

### AgentSpec (`core/base_agent.py`)
Deklarative Beschreibung **eines** Agenten — kein Subclassing nötig:

| Feld | Bedeutung |
|---|---|
| `name` | Schlüssel, matcht `config.yaml` + REGISTRY |
| `system_prompt` | vollständiger Prompt (darf Knowledge-Blöcke enthalten) |
| `output_model` | Pydantic-Klasse zur Validierung (z.B. `ProcessAuditOutput`) |
| `build_user_message(context)` | baut die User-Message aus dem Pipeline-Kontext |
| `parse(raw, context)` | optional — Custom-Parse (Default: `output_model.model_validate`) |
| `allowed_tools` | SDK-Tool-Namen, die der Agent nutzen darf |
| `model` / `max_tokens` | pro Agent überschreibbar (Default: Sonnet 4-6 / 20k) |

### SdkAgent (`core/base_agent.py`)
Führt einen `AgentSpec` über `claude_agent_sdk.query()` aus, sammelt die
Text-Blöcke, extrahiert JSON (Markdown-Fence- + trailing-comma-tolerant, gleiche
Logik wie `agents/_client`) und validiert gegen das `output_model`.
`run()` ist async, `run_sync()` ist der CLI-Wrapper.

### Orchestrator (`core/orchestrator.py`)
Kennt **keinen** konkreten Agenten. Bekommt eine `REGISTRY` (aus dem Pattern)
und eine `PatternConfig` (aus `config.yaml`), führt die aktivierten Schritte
seriell aus, reicht jeden Output unter seinem `name` in den `context` weiter
(sodass Folge-Agenten darauf zugreifen) und respektiert `pause_seconds`
(Anthropic-Tier-1-Rate-Limit, analog zum alten Orchestrator).

---

## 5. Einen neuen Agenten hinzufügen (Reusability)

Drei Schritte, **kein** Eingriff in core/:

1. **Datei anlegen** `agent_patterns/patterns/ai_adoption/<name>.py`:
   ```python
   from agent_patterns.core.base_agent import AgentSpec
   from schemas.outputs import MeinOutput

   SYSTEM_PROMPT = "Du bist … OUTPUT — nur JSON: { … }"

   def _user_msg(context):
       return context["briefing"].model_dump_json(indent=2)

   def build(context) -> AgentSpec:
       return AgentSpec(
           name="mein_agent",
           system_prompt=SYSTEM_PROMPT,
           output_model=MeinOutput,
           build_user_message=_user_msg,
       )
   ```

2. **In REGISTRY eintragen** (`patterns/ai_adoption/__init__.py`):
   ```python
   from agent_patterns.patterns.ai_adoption import mein_agent
   REGISTRY = { ..., "mein_agent": mein_agent.build }
   ```

3. **In `config.yaml` verdrahten**:
   ```yaml
   sequence:
     - agent: mein_agent
       enabled: true
   ```

Ein neues **Pattern** (andere Domäne) = neuer Ordner unter `patterns/`, eigene
`REGISTRY` + eigene `config.yaml`. Core + Tools bleiben unverändert wieder­verwendbar.

---

## 6. Python vs. bestehender FastAPI-Stand (side-by-side)

| Aspekt | Bestehender Stand (`agents/`, `runs/`) | Neue Library (`agent_patterns/`) |
|---|---|---|
| LLM-Zugriff | roher `anthropic`-Client (`agents/_client.call_agent`) | `claude-agent-sdk` `query()` (SdkAgent) |
| Agent-Definition | Modul mit `run(briefing) -> Pydantic` | deklarativer `AgentSpec` via `build(context)` |
| Reihenfolge / Pause | hart im Code (`agents/orchestrator.py`) | `config/config.yaml` (`sequence`, `pause_seconds`) |
| Welche Agenten laufen | Import-Liste im Orchestrator | REGISTRY + `enabled:`-Flags in der Config |
| Kontext-Weitergabe | benannte Argumente (`run(briefing, audit, …)`) | `context`-dict, Output unter `name` abgelegt |
| Tools | pro Agent von Hand | `allowed_tools` am AgentSpec + `tools/`-Modul |
| Knowledge-Pack | direkter Import in jedem Agent | `tools/knowledge_tool.py` (defensiv, read-only) |
| Output-Schema | `schemas/outputs.py` (geteilt) | **dieselben** `schemas/outputs.py` (wiederverwendet) |
| HTTP-Einbindung | `runs/pipeline_runner.py` → FastAPI `api/` | (noch offen — siehe „Nächste Schritte") |

**Wichtig:** Die Output-Schemas (`schemas/outputs.py`, `schemas/briefing.py`)
werden in beiden Welten **identisch** genutzt. Dadurch sind die Outputs der
SDK-Agenten 1:1 kompatibel mit dem bestehenden Reporter/Output-Generator — die
Migration kann Agent für Agent erfolgen, ohne den Rest zu brechen.

---

## 7. Migrations-Stand & nächste Schritte

**Migriert (alle Analyse-Agenten):**
- `web_research` — SDK-`WebSearch`-Tool (`allowed_tools=["WebSearch"]`), Custom-Parse → `WebResearchOutput`.
- `pre_audit_analyst` — Hypothesen vor dem Voice-Interview, Custom-Parse (Hypothesis-Liste).
- `document_analyst` — inkl. Custom-Parse (DocumentInsight-Liste).
- `process_auditor` — System-Prompt + Output (`ProcessAuditOutput`) verbatim übernommen.
- `use_case_generator` — VUFVE-Check, `UseCaseOutput`.
- `tool_recommender` — Vendor-Landschaft via `knowledge_extras.vendor_blocks`, `ToolRecommendationOutput`.
- `roi_calculator` — Business-Case, `ROIOutput`.
- `compliance_checker` — DSGVO/AI-Act-Flags, Custom-Parse (`ComplianceFlag`-Liste).
- `roadmap_generator` — 3-Phasen-Roadmap, Custom-Parse (`RoadmapPhase`-Liste).
- `reporter` — Executive Summary + Aggregation aller Kontext-Outputs zum `FullReport` (Custom-Parse).

**Bewusst NICHT migriert:** der Voice-/Interview-Agent (ElevenLabs) — kein
Claude-SDK-Agent, daher außerhalb dieses Patterns.

**Tools-Schicht ergänzt:** `tools/knowledge_extras.py` (read-only) liefert
Trends-, Pulse-, Vendor- und Compliance-Blöcke für die zusätzlichen Agenten —
analog defensiv zu `knowledge_tool.py`.

**Offene Verdrahtung / nächste Schritte:**
1. `web_research` + `pre_audit_analyst` sind in `config.yaml` per default
   `enabled: false`, weil ihr Input ein rohes `company`-dict (+ optional
   Voice-Transcript / documents_summary) ist, das nicht aus dem
   `briefing`-Kontext der Haupt-Pipeline kommt. Für einen Lauf den passenden
   `initial_context` mitliefern und `enabled: true` setzen.
2. `runs/pipeline_runner.py` (FastAPI-Pfad) optional auf `Orchestrator.run()`
   umstellen — der Reporter liefert bereits den fertigen `FullReport`.
3. Web-Search/Knowledge optional als echte SDK-`@tool`s registrieren (statt
   Prompt-Injection), wenn der Agent-Loop sie selbst aufrufen soll.

**Bewusst NICHT angefasst:** n8n (Instanz noch zu klären), bestehende Module,
`requirements.txt` im Repo-Root, `api/`, `runs/`.
