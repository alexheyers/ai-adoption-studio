"""ai_adoption — erstes konkretes Pattern (Hospitality-KI-Adoptions-Beratung).

Die REGISTRY bildet Agent-Namen (wie in config.yaml) auf Factory-Funktionen ab,
die einen AgentSpec aus dem laufenden Pipeline-Kontext bauen.

Einen neuen Agenten hinzufügen:
1. Neue Datei `agent_patterns/patterns/ai_adoption/<name>.py` mit `build(context) -> AgentSpec`
2. Hier in REGISTRY eintragen: "<name>": <name>.build
3. In agent_patterns/config/config.yaml in `sequence` aufnehmen
→ Orchestrator muss NICHT angefasst werden.
"""

from agent_patterns.patterns.ai_adoption import (
    compliance_checker,
    document_analyst,
    pre_audit_analyst,
    process_auditor,
    reporter,
    roadmap_generator,
    roi_calculator,
    tool_recommender,
    use_case_generator,
    web_research,
)

REGISTRY = {
    # Pre-Audit-Phase (vor Voice-Interview — Voice-Agent selbst ist ElevenLabs,
    # kein SDK-Agent, daher nicht enthalten):
    "web_research": web_research.build,
    "pre_audit_analyst": pre_audit_analyst.build,
    "document_analyst": document_analyst.build,
    # Haupt-Pipeline:
    "process_auditor": process_auditor.build,
    "use_case_generator": use_case_generator.build,
    "tool_recommender": tool_recommender.build,
    "roi_calculator": roi_calculator.build,
    "compliance_checker": compliance_checker.build,
    "roadmap_generator": roadmap_generator.build,
    "reporter": reporter.build,
}

__all__ = ["REGISTRY"]
