"""Zentrale Konfiguration für alle Agents."""
import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 20000  # Phase-13-Tiefe: 8-12 Prozesse × ~700 Tok + 19-Feld-Tool-Recs = ~12-16k

if not ANTHROPIC_API_KEY:
    raise RuntimeError("ANTHROPIC_API_KEY fehlt — kopier .env.example zu .env und trag den Key ein.")
