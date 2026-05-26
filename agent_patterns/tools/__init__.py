"""Modulare, wiederverwendbare Tools für die Agent-Library.

Tools sind hier zwei Dinge:
1. Reine Python-Helfer (z.B. Benchmark-Text bauen), die ein AgentSpec im
   System-Prompt oder in der User-Message einbettet — kein SDK nötig.
2. (optional, später) echte SDK-`@tool`-Definitionen, die der Agent zur
   Laufzeit aufruft. Vorbereitet über `register_sdk_tools()`.

Reusability: jedes Tool ist eine eigenständige Funktion ohne Pattern-Bezug,
sodass es über mehrere Patterns hinweg genutzt werden kann.
"""

from agent_patterns.tools.knowledge_tool import (
    benchmark_block,
    case_study_block,
    knowledge_available,
)

__all__ = [
    "benchmark_block",
    "case_study_block",
    "knowledge_available",
]
