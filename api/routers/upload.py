"""Document-Upload: lädt Files in Supabase Storage + legt Metadaten an."""
import os
import uuid
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form
from pydantic import BaseModel
from typing import Literal

from api.auth import AuthUser, get_current_user
from api.deps import supabase_for

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

router = APIRouter(prefix="/upload", tags=["upload"])

DocType = Literal["gv_report", "personal", "kpi", "process", "other"]


class UploadResponse(BaseModel):
    document_id: str
    storage_path: str
    parser_status: str


@router.post("", response_model=UploadResponse)
async def upload_document(
    file: UploadFile,
    company_id: str = Form(...),
    doc_type: DocType = Form("other"),
    user: AuthUser = Depends(get_current_user),
):
    sb = supabase_for(user)

    # Owner-Check
    company = sb.table("companies").select("id, owner_id").eq("id", company_id).maybe_single().execute()
    if not company or not company.data:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")
    if company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")

    document_id = str(uuid.uuid4())
    storage_path = f"{company_id}/{document_id}/{file.filename}"
    content = await file.read()

    # Direkter HTTP-Call zum Supabase-Storage (mit User-JWT — RLS greift)
    upload_url = f"{SUPABASE_URL}/storage/v1/object/documents/{storage_path}"
    upload_headers = {
        "Authorization": f"Bearer {user.jwt}",
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": file.content_type or "application/octet-stream",
        "x-upsert": "true",
    }
    try:
        with httpx.Client(timeout=60.0) as cx:
            up = cx.post(upload_url, headers=upload_headers, content=content)
        if up.status_code >= 300:
            raise HTTPException(status_code=500, detail=f"Storage-Upload fehlgeschlagen: {up.status_code} · {up.text[:200]}")
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Storage-Upload-Netzwerkfehler: {e}")

    # Metadaten
    sb.table("documents").insert({
        "id": document_id,
        "company_id": company_id,
        "uploader_id": user.id,
        "storage_path": storage_path,
        "filename": file.filename,
        "mime_type": file.content_type,
        "file_size_bytes": len(content),
        "doc_type": doc_type,
        "parser_status": "pending",
    }).execute()

    # Parser inline triggern
    parser_status = "pending"
    try:
        from documents.parser import parse_document_inline
        parse_document_inline(document_id, storage_path, file.content_type or "", user_jwt=user.jwt)
        parser_status = "parsed"
    except Exception as e:
        sb.table("documents").update({
            "parser_status": "failed",
            "parser_error": str(e)[:500],
        }).eq("id", document_id).execute()
        parser_status = "failed"
        print(f"[parser] {document_id} failed: {e}")

    return UploadResponse(
        document_id=document_id,
        storage_path=storage_path,
        parser_status=parser_status,
    )


@router.get("/list/{company_id}")
def list_documents(company_id: str, user: AuthUser = Depends(get_current_user)):
    sb = supabase_for(user)
    company = sb.table("companies").select("owner_id").eq("id", company_id).maybe_single().execute()
    if not company or not company.data or company.data["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Company gehört nicht dem User")
    docs = sb.table("documents").select("*").eq("company_id", company_id).order("created_at", desc=True).execute()
    return {"documents": docs.data or []}
