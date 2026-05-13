"""Geteilter Anthropic-Client + JSON-Helper."""
import json
import re
from anthropic import Anthropic

from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS

client = Anthropic(api_key=ANTHROPIC_API_KEY)


def call_agent(system_prompt: str, user_message: str) -> dict:
    """Ruft Claude auf und parsed JSON aus der Antwort.

    Erwartet, dass der System-Prompt sagt: 'Antworte nur mit JSON.'
    """
    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
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
    return _extract_json(text)


def _extract_json(text: str) -> dict:
    """Extrahiert JSON aus Claude-Antwort — toleriert Markdown-Code-Fences,
    trailing commas und einzelne Quote-Probleme.
    """
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
            cleaned = re.sub(r",(\s*[}\]])", r"\1", raw)  # trailing commas killen
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                continue

    raise ValueError(f"Keine parsbare JSON-Struktur in Claude-Antwort:\n{text[:1500]}…")
