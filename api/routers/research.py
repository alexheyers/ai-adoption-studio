"""Web-Research-Endpoints: triggert den Web-Research-Agent für eine Company."""
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from api.auth import AuthUser, get_current_user
from api.deps import supabase_for

router = APIRouter(prefix="/research", tags=["research"])


class ResearchStartPayload(BaseModel):
    company_id: str


class ResearchStartResponse(BaseModel):
    research_id: str
    status: str


@router.post("/start", response_model=ResearchStartResponse)
def start_research(
    payload: ResearchStartPayload,
    background: BackgroundTasks,
    user: AuthUser = Depends(get_current_user),
):
    sb = supabase_for(user)

    company = sb.table("companies").select("*").eq("id", payload.company_id).maybe_single().execute()
    if not company or not company.data or company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")

    res = sb.table("web_research").insert({
        "company_id": payload.company_id,
        "status": "pending",
    }).execute()
    research_id = res.data[0]["id"]

    from agents.web_research import run_research_async
    background.add_task(run_research_async, research_id, company.data, user.jwt)

    return ResearchStartResponse(research_id=research_id, status="pending")


@router.get("/{research_id}")
def get_research(research_id: str, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)
    res = sb.table("web_research").select("*, companies(owner_id)").eq("id", research_id).maybe_single().execute()
    if not res or not res.data:
        raise HTTPException(status_code=404, detail="Research nicht gefunden")
    if res.data["companies"]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Research gehört nicht dem User")
    return res.data
