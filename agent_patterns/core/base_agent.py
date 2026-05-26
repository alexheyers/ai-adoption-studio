"""Basis-Agent auf dem Claude Agent SDK.

Dieser Baustein kapselt EINEN wiederverwendbaren Agent-Lauf: System-Prompt rein,
User-Message rein → validiertes Pydantic-Modell raus. Er ist bewusst nah am
bestehenden `agents/_client.call_agent()`-Vertrag gehalten, damit die Migration
1:1 möglich ist — aber er läuft auf dem `claude-agent-sdk` statt direkt auf dem
rohen `anthropic`-Client.

Warum SDK statt rohem anthropic-Client:
    - Einheitliche Tool-/Permission-/MCP-Schicht (Tools werden hier als
      `allowed_tools` + MCP-Server konfiguriert, statt pro Agent von Hand)
    - Eingebaute Agent-Loop (mehrere Tool-Roundtrips ohne eigene While-Schleife)
    - Gleiche Abstraktion wie Claude Code selbst → ein mentales Modell

Graceful Degradation:
    Ist `claude-agent-sdk` (noch) nicht installiert, wird beim ERSTEN Lauf ein
    klarer ImportError mit Install-Hinweis geworfen. Import des Pakets selbst
    bleibt möglich (z.B. für Tests der Config-Schicht).
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any, Callable, Type, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

# --- Default-Modelle (überschreibbar pro AgentSpec) -------------------------
# Bewusst identisch zum bestehenden config.py, damit Output-Tiefe gleich bleibt.
DEFAULT_MODEL = "claude-sonnet-4-6"
DEFAULT_MAX_TOKENS = 20000


# ---------------------------------------------------------------------------
# JSON-Extraktion — identische Toleranz-Logik wie agents/_client._extract_json
# (Markdown-Fences, trailing commas). Bewusst dupliziert, damit agent_patterns
# KEINE Abhängigkeit auf den Alt-Code hat und eigenständig wiederverwendbar ist.
# ---------------------------------------------------------------------------
def extract_json(text: str) -> dict:
    candidates: list[str] = []

    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        candidates.append(fenced.group(1))

    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1:
        candidates.append(text[first_brace : last_brace + 1])

    for raw in candidates:
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            cleaned = re.sub(r",(\s*[}\]])", r"\1", raw)
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                continue

    raise ValueError(f"Keine parsbare JSON-Struktur in SDK-Antwort:\n{text[:1500]}…")


# ---------------------------------------------------------------------------
# AgentSpec — die deklarative Beschreibung eines Agenten.
# Genau das, was ein neuer Agent liefern muss. Kein Vererben einer Klasse nötig.
# ---------------------------------------------------------------------------
@dataclass
class AgentSpec:
    """Deklarative Beschreibung eines Agenten — config-driven & wiederverwendbar.

    name:           eindeutiger Schlüssel (matcht config.yaml)
    system_prompt:  vollständiger System-Prompt (darf Knowledge-Blöcke enthalten)
    output_model:   Pydantic-Klasse, gegen die validiert wird
    build_user_message: Funktion (context: dict) -> str ; baut die User-Message
                    aus dem laufenden Pipeline-Kontext
    parse:          optionale Custom-Parse-Funktion (raw_json, context) -> BaseModel.
                    Default: output_model.model_validate(raw_json)
    allowed_tools:  Tool-Namen, die dieser Agent über das SDK nutzen darf
    model / max_tokens: pro Agent überschreibbar
    """

    name: str
    system_prompt: str
    output_model: Type[BaseModel]
    build_user_message: Callable[[dict[str, Any]], str]
    parse: Callable[[dict, dict[str, Any]], BaseModel] | None = None
    allowed_tools: list[str] = field(default_factory=list)
    model: str = DEFAULT_MODEL
    max_tokens: int = DEFAULT_MAX_TOKENS

    def parse_result(self, raw_json: dict, context: dict[str, Any]) -> BaseModel:
        if self.parse is not None:
            return self.parse(raw_json, context)
        return self.output_model.model_validate(raw_json)


@dataclass
class AgentResult:
    """Ergebnis eines Agent-Laufs."""

    agent_name: str
    output: BaseModel
    raw_text: str


# ---------------------------------------------------------------------------
# SdkAgent — führt einen AgentSpec auf dem Claude Agent SDK aus.
# ---------------------------------------------------------------------------
class SdkAgent:
    """Führt einen einzelnen AgentSpec über das Claude Agent SDK aus."""

    def __init__(self, spec: AgentSpec):
        self.spec = spec

    async def run(self, context: dict[str, Any]) -> AgentResult:
        """Async-Lauf über das SDK. context = laufender Pipeline-Zustand.

        Liefert AgentResult mit validiertem Pydantic-Output.
        """
        sdk = _import_sdk()
        ClaudeAgentOptions = sdk["ClaudeAgentOptions"]
        query = sdk["query"]

        user_message = self.spec.build_user_message(context)

        options = ClaudeAgentOptions(
            system_prompt=self.spec.system_prompt,
            model=self.spec.model,
            max_turns=4 if not self.spec.allowed_tools else 12,
            allowed_tools=self.spec.allowed_tools or [],
            # Single-shot Struktur-Agenten brauchen keine Datei-/Shell-Tools.
            permission_mode="default",
        )

        raw_text = await self._query_text(query, user_message, options)
        try:
            output = self.spec.parse_result(extract_json(raw_text), context)
        except Exception as exc:
            # Repair-Versuch: dem Modell den Validierungs-/Parse-Fehler zeigen und
            # korrigiertes, vollständiges JSON anfordern. Macht die strikte
            # Pydantic-Validierung robust gegen vereinzelt fehlende Pflichtfelder.
            repair_prompt = (
                "Deine vorige JSON-Antwort war unvollständig oder ungültig.\n"
                f"Fehler: {exc}\n\n"
                "Vorige Antwort:\n" + raw_text[:6000] + "\n\n"
                "Gib AUSSCHLIESSLICH korrigiertes, vollständiges JSON zurück — alle "
                "Pflichtfelder ausgefüllt, keine Erklärung, kein Markdown-Fence."
            )
            raw_text = await self._query_text(query, repair_prompt, options)
            output = self.spec.parse_result(extract_json(raw_text), context)
        return AgentResult(agent_name=self.spec.name, output=output, raw_text=raw_text)

    async def _query_text(self, query, prompt: str, options) -> str:
        """Ein SDK-Query → zusammengesetzter Text aller Assistant-Blocks."""
        chunks: list[str] = []
        async for message in query(prompt=prompt, options=options):
            chunks.append(_text_of(message))
        return "".join(c for c in chunks if c)

    def run_sync(self, context: dict[str, Any]) -> AgentResult:
        """Synchroner Wrapper für CLI-/Test-Nutzung."""
        import asyncio

        return asyncio.run(self.run(context))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _import_sdk() -> dict[str, Any]:
    """Lazy-Import des Claude Agent SDK mit klarem Install-Hinweis."""
    try:
        from claude_agent_sdk import ClaudeAgentOptions, query  # type: ignore
    except ImportError as exc:  # pragma: no cover - reiner Setup-Pfad
        raise ImportError(
            "claude-agent-sdk ist nicht installiert.\n"
            "Installiere es NUR ins lokale venv:\n"
            "  .venv/bin/pip install claude-agent-sdk\n"
            "(siehe agent_patterns/requirements.txt)"
        ) from exc
    return {"ClaudeAgentOptions": ClaudeAgentOptions, "query": query}


def _text_of(message: Any) -> str:
    """Extrahiert Text aus einem SDK-Message-Objekt, defensiv gegen API-Drift.

    Das SDK liefert AssistantMessage mit `.content` = Liste von Blocks
    (TextBlock hat `.text`). Wir greifen tolerant zu, damit kleinere
    SDK-Versions-Unterschiede nicht sofort brechen.
    """
    content = getattr(message, "content", None)
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            text = getattr(block, "text", None)
            if isinstance(text, str):
                parts.append(text)
        return "".join(parts)
    # ResultMessage / SystemMessage etc. → kein Text
    return ""
