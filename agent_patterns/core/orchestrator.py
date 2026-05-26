"""Config-getriebener Orchestrator für die agent_patterns-Library.

Liest eine `config.yaml` (welche Agenten, welche Reihenfolge, welche Pause)
und führt die in einem Pattern registrierten Agenten seriell aus. Der
Orchestrator selbst kennt KEINEN konkreten Agenten — alles kommt aus der
Registry des Patterns + der Config. Genau das macht ihn wiederverwendbar:
Ein neues Pattern liefert seine eigene Registry, der Orchestrator bleibt gleich.

Bewusst nah am bestehenden `agents/orchestrator.py` (serielle Ausführung +
Rate-Limit-Pause), aber:
    - Reihenfolge & Pause kommen aus config.yaml statt aus Code
    - Agenten kommen aus einer Registry (dict[name -> AgentSpec])
    - Kontext wird zwischen Agenten als dict weitergereicht
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

import yaml

from agent_patterns.core.base_agent import AgentResult, AgentSpec, SdkAgent

# Registry-Typ: ein Pattern liefert name -> Factory, die einen AgentSpec baut.
AgentFactory = Callable[[dict[str, Any]], AgentSpec]
Registry = dict[str, AgentFactory]


@dataclass
class PatternConfig:
    """Geparste config.yaml für ein Pattern."""

    name: str
    description: str
    pause_seconds: float
    sequence: list[dict[str, Any]] = field(default_factory=list)
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_yaml(cls, path: str | Path) -> "PatternConfig":
        data = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
        return cls(
            name=data.get("name", "unnamed"),
            description=data.get("description", ""),
            pause_seconds=float(data.get("pause_seconds", 8)),
            sequence=data.get("sequence", []),
            raw=data,
        )

    def enabled_steps(self) -> list[dict[str, Any]]:
        """Nur aktivierte Schritte, in Config-Reihenfolge."""
        return [s for s in self.sequence if s.get("enabled", True)]


class Orchestrator:
    """Führt ein Pattern config-getrieben aus.

    registry: name -> AgentFactory (aus dem Pattern, z.B. ai_adoption.REGISTRY)
    config:   PatternConfig (aus config.yaml)
    """

    def __init__(self, registry: Registry, config: PatternConfig):
        self.registry = registry
        self.config = config

    async def run(
        self,
        initial_context: dict[str, Any],
        verbose: bool = True,
        on_step: Callable[[str, str, int, int, "AgentResult | None"], None] | None = None,
    ) -> dict[str, AgentResult]:
        """Führt alle aktivierten Agenten seriell aus.

        Jeder Agent-Output landet unter seinem `name` im Kontext, sodass
        nachfolgende Agenten darauf zugreifen können. Rückgabe: name -> AgentResult.
        """
        context: dict[str, Any] = dict(initial_context)
        results: dict[str, AgentResult] = {}
        steps = self.config.enabled_steps()

        if verbose:
            print(f"\n=== Pattern '{self.config.name}' — {len(steps)} Agenten ===\n")

        for idx, step in enumerate(steps, start=1):
            name = step["agent"]
            if name not in self.registry:
                raise KeyError(
                    f"Agent '{name}' in config.yaml, aber nicht in der Registry. "
                    f"Bekannt: {sorted(self.registry)}"
                )

            spec = self.registry[name](context)
            agent = SdkAgent(spec)

            if verbose:
                print(f"[{idx}/{len(steps)}] {name} …")
            if on_step:
                on_step("start", name, idx, len(steps), None)

            result = await agent.run(context)
            results[name] = result
            # Output für Folge-Agenten verfügbar machen.
            context[name] = result.output
            if on_step:
                on_step("done", name, idx, len(steps), result)

            if verbose:
                print(f"      → {name} fertig ({type(result.output).__name__})")

            # Rate-Limit-Pause (Anthropic Tier-1) — letzter Agent ohne Pause.
            if idx < len(steps) and self.config.pause_seconds > 0:
                await asyncio.sleep(self.config.pause_seconds)

        if verbose:
            print("\n=== Pattern fertig ===\n")
        return results

    def run_sync(
        self,
        initial_context: dict[str, Any],
        verbose: bool = True,
        on_step: Callable[[str, str, int, int, "AgentResult | None"], None] | None = None,
    ) -> dict[str, AgentResult]:
        return asyncio.run(self.run(initial_context, verbose=verbose, on_step=on_step))
