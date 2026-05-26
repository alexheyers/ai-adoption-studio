"""Patterns — konkrete, fertig verdrahtete Agent-Sequenzen.

Ein Pattern = eine Domäne (z.B. ai_adoption für Hospitality-KI-Beratung).
Jedes Pattern liefert eine REGISTRY (name -> AgentSpec-Factory), die der
Orchestrator zusammen mit der config.yaml ausführt.
"""
