"""Geteilter Anthropic-Client + JSON-Helper."""
import json
import re
from anthropic import Anthropic

from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS

# timeout bounded pro Request (gegen unendliches Hängen eines Agenten in der Pipeline);
# max_retries = SDK-eigene Wiederholung bei transient API-Fehlern (429/500/Connection).
client = Anthropic(api_key=ANTHROPIC_API_KEY, timeout=180.0, max_retries=2)


def call_agent(system_prompt: str, user_message: str, _attempts: int = 3) -> dict:
    """Ruft Claude auf und parsed JSON aus der Antwort.

    Erwartet, dass der System-Prompt sagt: 'Antworte nur mit JSON.'
    Robust gegen transient malformed/abgeschnittenes JSON: bis zu _attempts Versuche.
    Bei max_tokens-Abschnitt (truncation) wird das Token-Budget im Retry erhöht.
    """
    last_err: Exception | None = None
    for attempt in range(_attempts):
        max_tokens = MAX_TOKENS if attempt == 0 else min(int(MAX_TOKENS * 1.5), 32000)
        response = client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": user_message}],
        )
        text = response.content[0].text
        try:
            return _extract_json(text)
        except ValueError as e:
            last_err = e
            stop = getattr(response, "stop_reason", "?")
            print(f"[call_agent] JSON-Parse fehlgeschlagen (Versuch {attempt + 1}/{_attempts}, stop_reason={stop}) — retry")
    # Alle Versuche erschöpft
    raise last_err  # type: ignore[misc]


def _extract_json(text: str) -> dict:
    """Extrahiert JSON aus Claude-Antwort — toleriert Markdown-Code-Fences,
    trailing commas und einzelne Quote-Probleme.
    """
    candidates: list[str] = []

    # GREEDY (.*) — sonst bricht der Match bei verschachteltem JSON am ersten "}" ab.
    fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
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
            cleaned = re.sub(r",(\s*[}\]])", r"\1", raw)  # trailing commas killen
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                continue

    raise ValueError(f"Keine parsbare JSON-Struktur in Claude-Antwort:\n{text[:1500]}…")
