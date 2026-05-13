"""Document-Parser: PDF, Excel, CSV, DOCX → Klartext + extrahierte KPIs.

Strategie:
  - PDF: pdfplumber → Text. Tabellen werden best-effort als "Tabelle: ..." inline.
  - Excel/CSV: pandas/openpyxl → strukturierte KPI-Suche (ADR, Occupancy, Personalkosten etc.).
  - DOCX: python-docx → Text.
  - Output landet in documents.parsed_text + documents.extracted_kpis (jsonb).
"""
import io
import os
import re
from typing import Any

import httpx

from agents._supabase import get_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")


def _parse_pdf(content: bytes) -> str:
    import pdfplumber
    text_chunks: list[str] = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            page_text = page.extract_text() or ""
            text_chunks.append(f"--- Seite {i} ---\n{page_text}")
            tables = page.extract_tables() or []
            for tbl in tables:
                rows = ["\t".join(str(c) if c else "" for c in row) for row in tbl]
                text_chunks.append("Tabelle:\n" + "\n".join(rows))
    return "\n\n".join(text_chunks)


def _parse_excel(content: bytes) -> tuple[str, dict]:
    import pandas as pd
    xls = pd.ExcelFile(io.BytesIO(content))
    text_chunks: list[str] = []
    found_kpis: dict[str, Any] = {}
    for sheet_name in xls.sheet_names:
        df = xls.parse(sheet_name)
        text_chunks.append(f"--- Sheet: {sheet_name} ---")
        text_chunks.append(df.to_string(max_rows=80, max_cols=20))
        found_kpis.update(_extract_kpis_from_dataframe(df))
    return ("\n\n".join(text_chunks), found_kpis)


def _parse_csv(content: bytes) -> tuple[str, dict]:
    import pandas as pd
    df = pd.read_csv(io.BytesIO(content))
    text = f"--- CSV ---\n{df.to_string(max_rows=80, max_cols=20)}"
    return (text, _extract_kpis_from_dataframe(df))


def _parse_docx(content: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


_KPI_KEYS = {
    "adr_eur": [r"\badr\b", r"average daily rate", r"durchschnittlicher zimmerpreis"],
    "revpar_eur": [r"\brevpar\b", r"revenue per available room"],
    "occupancy_rate": [r"\bauslastung", r"\bbelegung", r"\boccupancy"],
    "personal_quote": [r"personalkosten[- ]?quote", r"personalkosten in %"],
    "gop_margin": [r"\bgop\b", r"gross operating profit"],
}


def _extract_kpis_from_dataframe(df) -> dict:
    """Sucht in einem DataFrame nach KPI-Pattern und extrahiert Werte rechts der Bezeichnung."""
    found: dict[str, Any] = {}
    try:
        for _, row in df.iterrows():
            row_str = " ".join(str(v) for v in row.tolist() if v is not None).lower()
            for kpi_key, patterns in _KPI_KEYS.items():
                if kpi_key in found:
                    continue
                for pat in patterns:
                    if re.search(pat, row_str):
                        # Suche eine Zahl in der Zeile
                        for v in row.tolist():
                            if isinstance(v, (int, float)) and v > 0:
                                found[kpi_key] = float(v)
                                break
                        break
    except Exception:
        pass
    return found


def parse_document_inline(document_id: str, storage_path: str, mime_type: str, user_jwt: str) -> None:
    """Lädt File aus Storage, parsed, schreibt parsed_text + extracted_kpis zurück."""
    sb = get_client(user_jwt=user_jwt)
    # Direkter HTTP-Download (storage3-Client durchschleift JWT manchmal nicht)
    download_url = f"{SUPABASE_URL}/storage/v1/object/documents/{storage_path}"
    with httpx.Client(timeout=60.0) as cx:
        r = cx.get(download_url, headers={
            "Authorization": f"Bearer {user_jwt}",
            "apikey": SUPABASE_ANON_KEY,
        })
        if r.status_code >= 300:
            raise RuntimeError(f"Download fehlgeschlagen: {r.status_code} · {r.text[:200]}")
        file_bytes = r.content

    parsed_text = ""
    extracted_kpis: dict = {}

    mt = (mime_type or "").lower()
    if "pdf" in mt:
        parsed_text = _parse_pdf(file_bytes)
    elif "spreadsheet" in mt or "excel" in mt or storage_path.lower().endswith((".xlsx", ".xls")):
        parsed_text, extracted_kpis = _parse_excel(file_bytes)
    elif "csv" in mt or storage_path.lower().endswith(".csv"):
        parsed_text, extracted_kpis = _parse_csv(file_bytes)
    elif "wordprocessingml" in mt or "msword" in mt or storage_path.lower().endswith(".docx"):
        parsed_text = _parse_docx(file_bytes)
    elif mt.startswith("text/"):
        parsed_text = file_bytes.decode("utf-8", errors="replace")
    else:
        raise RuntimeError(f"Unbekannter mime_type: {mime_type}")

    sb.table("documents").update({
        "parsed_text": parsed_text[:50000],
        "extracted_kpis": extracted_kpis,
        "parser_status": "parsed",
    }).eq("id", document_id).execute()
