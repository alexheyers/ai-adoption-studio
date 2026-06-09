"""Multi-Agent-Pipeline-Runs: Trigger + Status + Report + Deliverable-Generierung."""
import os

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from api.auth import AuthUser, get_current_user
from api.deps import supabase_for
from schemas.outputs import FullReport

router = APIRouter(prefix="/run", tags=["run"])

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

# Welche Formate kennt die Pipeline + welcher Content-Type gehört dazu.
_DELIVERABLE_CONTENT_TYPES = {
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}


def _load_full_report(sb, run_id: str) -> FullReport:
    """Lädt das vom Reporter aggregierte FullReport-Result eines Runs."""
    res = (
        sb.table("run_results")
        .select("output")
        .eq("run_id", run_id)
        .eq("agent_name", "full_report")
        .maybe_single()
        .execute()
    )
    if not res or not res.data or not res.data.get("output"):
        raise HTTPException(status_code=409, detail="Run hat noch kein fertiges full_report-Ergebnis")
    try:
        return FullReport.model_validate(res.data["output"])
    except Exception as e:  # pragma: no cover - defensiv
        raise HTTPException(status_code=500, detail=f"full_report nicht lesbar: {e}")


def _upload_deliverable(run_id: str, fmt: str, content: bytes, user_jwt: str) -> str:
    """Lädt ein generiertes Deliverable in den deliverables-Bucket (User-JWT → RLS)."""
    storage_path = f"{run_id}/report.{fmt}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/deliverables/{storage_path}"
    headers = {
        "Authorization": f"Bearer {user_jwt}",
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": _DELIVERABLE_CONTENT_TYPES[fmt],
        "x-upsert": "true",
    }
    try:
        with httpx.Client(timeout=60.0) as cx:
            up = cx.post(upload_url, headers=headers, content=content)
        if up.status_code >= 300:
            raise HTTPException(
                status_code=500,
                detail=f"Deliverable-Upload fehlgeschlagen ({fmt}): {up.status_code} · {up.text[:200]}",
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Deliverable-Upload-Netzwerkfehler: {e}")
    return storage_path


class RunStartPayload(BaseModel):
    company_id: str
    voice_session_id: str | None = None
    web_research_id: str | None = None


class RunStartResponse(BaseModel):
    run_id: str
    status: str


@router.post("/start", response_model=RunStartResponse)
def start_run(
    payload: RunStartPayload,
    background: BackgroundTasks,
    user: AuthUser = Depends(get_current_user),
):
    sb = supabase_for(user)

    company = sb.table("companies").select("*").eq("id", payload.company_id).maybe_single().execute()
    if not company or not company.data or company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")

    # Briefing aus Company + Voice-Transcript + Web-Research zusammenbauen
    from runs.briefing_builder import build_briefing
    briefing = build_briefing(
        company=company.data,
        voice_session_id=payload.voice_session_id,
        web_research_id=payload.web_research_id,
        user_jwt=user.jwt,
    )

    res = sb.table("runs").insert({
        "company_id": payload.company_id,
        "voice_session_id": payload.voice_session_id,
        "web_research_id": payload.web_research_id,
        "briefing": briefing.model_dump(mode="json"),
        "status": "pending",
        "current_step": "queued",
    }).execute()

    run_id = res.data[0]["id"]

    # Pipeline im Hintergrund starten (für MVP reicht BackgroundTasks; Production: Celery/RQ)
    # Engine-Wahl per Feature-Flag: USE_SDK_PIPELINE=true → Claude-Agent-SDK-Pipeline,
    # sonst der bestehende Runner. So bleibt der Live-Pfad ohne Flag unverändert.
    import os
    if os.getenv("USE_SDK_PIPELINE", "").strip().lower() in ("1", "true", "yes"):
        from runs.pipeline_runner_sdk import run_pipeline_async
    else:
        from runs.pipeline_runner import run_pipeline_async
    background.add_task(run_pipeline_async, run_id, briefing.model_dump(mode="json"), user.jwt)

    return RunStartResponse(run_id=run_id, status="pending")


@router.get("/{run_id}")
def get_run(run_id: str, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)
    run = sb.table("runs").select("*, companies(owner_id)").eq("id", run_id).maybe_single().execute()
    if not run or not run.data:
        raise HTTPException(status_code=404, detail="Run nicht gefunden")
    if run.data["companies"]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Run gehört nicht dem User")

    results = sb.table("run_results").select("*").eq("run_id", run_id).execute()
    return {
        "run": run.data,
        "results": {r["agent_name"]: r["output"] for r in (results.data or [])},
    }


@router.post("/{run_id}/generate")
def generate_deliverables(run_id: str, user: AuthUser = Depends(get_current_user)):
    """Generiert PPTX (ALE-32) + XLSX (ALE-33) aus dem FullReport und legt sie
    im deliverables-Bucket ab. Danach via GET /run/{run_id}/download/{fmt} abrufbar.

    Die eigentliche Generierung liegt in report_builders/pptx_generator.py + report_builders/excel_generator.py.
    """
    sb = supabase_for(user)
    run = sb.table("runs").select("status, companies(owner_id)").eq("id", run_id).maybe_single().execute()
    if not run or not run.data or run.data["companies"]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Run gehört nicht dem User")

    report = _load_full_report(sb, run_id)

    # Generatoren aus den dedizierten Output-Modulen (ALE-32 / ALE-33)
    from report_builders import build_excel, build_pptx

    pptx_bytes = build_pptx(report)
    xlsx_bytes = build_excel(report)

    pptx_path = _upload_deliverable(run_id, "pptx", pptx_bytes, user.jwt)
    xlsx_path = _upload_deliverable(run_id, "xlsx", xlsx_bytes, user.jwt)

    return {
        "run_id": run_id,
        "generated": ["pptx", "xlsx"],
        "paths": {"pptx": pptx_path, "xlsx": xlsx_path},
    }


@router.get("/{run_id}/download/{fmt}")
def download_deliverable(run_id: str, fmt: str, user: AuthUser = Depends(get_current_user)):
    """Signed-URL für ein generiertes Deliverable. fmt ∈ {xlsx, pptx, pdf}."""
    if fmt not in {"xlsx", "pptx", "pdf"}:
        raise HTTPException(status_code=400, detail="fmt muss xlsx, pptx oder pdf sein")
    sb = supabase_for(user)
    run = sb.table("runs").select("companies(owner_id)").eq("id", run_id).maybe_single().execute()
    if not run or not run.data or run.data["companies"]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Run gehört nicht dem User")

    storage_path = f"{run_id}/report.{fmt}"
    try:
        signed = sb.storage.from_("deliverables").create_signed_url(storage_path, 3600)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Deliverable nicht gefunden: {e}")
    url = signed.get("signedURL") or signed.get("signed_url") if isinstance(signed, dict) else getattr(signed, "signed_url", None)
    return {"format": fmt, "signed_url": url, "expires_in": 3600}


@router.get("/list/{company_id}")
def list_runs(company_id: str, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)
    company = sb.table("companies").select("owner_id").eq("id", company_id).maybe_single().execute()
    if not company or not company.data or company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")
    runs = sb.table("runs").select("id, status, current_step, created_at, completed_at").eq("company_id", company_id).order("created_at", desc=True).execute()
    return {"runs": runs.data or []}
