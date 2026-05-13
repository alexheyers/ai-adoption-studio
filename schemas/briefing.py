"""Briefing-Schema — was als Input ins Multi-Agent-System geht."""
from typing import Literal
from pydantic import BaseModel, Field


class CompanyContext(BaseModel):
    name: str
    industry: Literal["Hospitality"] = "Hospitality"
    sub_segment: str = Field(description="z.B. 'Hotellerie', 'Gastronomie', 'Boutique-Hotel-Gruppe'")
    size_class: Literal["S", "M", "L", "XL"]
    employees: int
    locations: int
    annual_revenue_eur: int
    region: str = Field(description="z.B. 'Berlin', 'Bayern', 'DACH'")


class HospitalityKPIs(BaseModel):
    adr_eur: float | None = Field(None, description="Average Daily Rate in EUR")
    revpar_eur: float | None = Field(None, description="Revenue per Available Room in EUR")
    occupancy_rate: float | None = Field(None, description="Auslastung in Prozent (0-100)")
    personal_quote: float | None = Field(None, description="Personal-Kostenquote vom Umsatz (0-100)")
    gop_margin: float | None = Field(None, description="Gross Operating Profit Margin (0-100)")


class PainPoint(BaseModel):
    description: str
    severity: Literal["high", "medium", "low"]
    affected_processes: list[str]


class Briefing(BaseModel):
    company: CompanyContext
    kpis: HospitalityKPIs
    pain_points: list[PainPoint]
    current_tools: list[str] = Field(description="Bestehende Software-Stack")
    documents_summary: str = Field(description="Zusammenfassung der hochgeladenen Dokumente")
    voice_interview_transcript: str | None = None
    notes: str | None = None
