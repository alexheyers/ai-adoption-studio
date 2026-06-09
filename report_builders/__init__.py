"""Deliverable-Generatoren für fertige Runs.

- build_pptx(report)  → 10-Slide-Board-Deck (.pptx als bytes)  [ALE-32]
- build_excel(report) → ROI-Rechner + Tool-Vergleichsmatrix (.xlsx als bytes)  [ALE-33]
"""
from .excel_generator import build_excel
from .pptx_generator import build_pptx

__all__ = ["build_pptx", "build_excel"]
