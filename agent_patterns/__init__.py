"""agent_patterns — Wiederverwendbare Multi-Agent-Library auf dem Claude Agent SDK.

Ziel: Eine config-getriebene, modulare Agent-Library, die unabhängig vom
bestehenden FastAPI-/`agents/`-Code wächst. Bestehender Code bleibt unberührt;
dieses Paket ist die neue Fundament-Schicht.

Kern-Bausteine:
    core.base_agent.SdkAgent      — Basis-Agent auf dem Claude Agent SDK
    core.orchestrator.Orchestrator — config-getriebener serieller Runner
    config/config.yaml             — welche Agenten, welche Tools, Reihenfolge
    patterns/ai_adoption/          — erstes konkretes Pattern (Hospitality)
    tools/                         — modulare, wiederverwendbare Tools

Reusability-Prinzip: Ein neuer Agent = eine neue Datei in `patterns/<name>/`
mit einer `build()`-Funktion, die ein `AgentSpec` zurückgibt + ein Eintrag in
der `config.yaml`. Kein Eingriff in den Orchestrator nötig.
"""

from agent_patterns.core.base_agent import AgentSpec, SdkAgent, AgentResult
from agent_patterns.core.orchestrator import Orchestrator, PatternConfig

__all__ = [
    "AgentSpec",
    "SdkAgent",
    "AgentResult",
    "Orchestrator",
    "PatternConfig",
]

__version__ = "0.1.0"
