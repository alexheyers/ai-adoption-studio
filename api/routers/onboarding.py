"""Onboarding: Profile + Company anlegen/aktualisieren."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

from api.auth import AuthUser, get_current_user
from api.deps import supabase_for

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


class OnboardingPayload(BaseModel):
    full_name: str = Field(min_length=2)
    phone: str | None = None
    company_name: str = Field(min_length=2)
    sub_segment: str = Field(description="z.B. 'Hotellerie', 'Gastronomie'")
    size_class: Literal["S", "M", "L", "XL"]
    employees: int = Field(ge=1, le=100000)
    locations: int = Field(default=1, ge=1)
    annual_revenue_eur: int = Field(ge=0)
    region: str
    website: str | None = None
    pain_points_freitext: str | None = None


class OnboardingResponse(BaseModel):
    profile_id: str
    company_id: str


@router.post("", response_model=OnboardingResponse)
def create_onboarding(
    payload: OnboardingPayload,
    user: AuthUser = Depends(get_current_user),
):
    sb = supabase_for(user)

    # Profile upsert (Trigger handle_new_user hat eh schon das Profile angelegt — wir updaten nur)
    sb.table("profiles").upsert({
        "id": user.id,
        "email": user.email,
        "full_name": payload.full_name,
        "phone": payload.phone,
    }).execute()

    pain_points = []
    if payload.pain_points_freitext:
        pain_points.append({
            "description": payload.pain_points_freitext,
            "severity": "medium",
            "affected_processes": [],
        })

    res = sb.table("companies").insert({
        "owner_id": user.id,
        "name": payload.company_name,
        "industry": "Hospitality",
        "sub_segment": payload.sub_segment,
        "size_class": payload.size_class,
        "employees": payload.employees,
        "locations": payload.locations,
        "annual_revenue_eur": payload.annual_revenue_eur,
        "region": payload.region,
        "website": payload.website,
        "pain_points": pain_points,
    }).execute()

    if not res.data:
        raise HTTPException(status_code=500, detail="Company-Insert fehlgeschlagen")

    return OnboardingResponse(profile_id=user.id, company_id=res.data[0]["id"])


@router.get("/me")
def get_me(user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)
    profile = sb.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
    companies = sb.table("companies").select("*").eq("owner_id", user.id).execute()
    return {
        "user": {"id": user.id, "email": user.email, "full_name": user.full_name},
        "profile": profile.data if profile and profile.data else None,
        "companies": companies.data or [],
    }
