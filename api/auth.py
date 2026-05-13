"""JWT-Verify via Supabase Auth API.

KEIN lokales JWT_SECRET nötig — wir fragen Supabase direkt: gehört dieser Token
zu einem gültigen User? Robuster gegen Key-Rotation, kein Geheimnis im Backend.
"""
import os
import httpx
from fastapi import Depends, HTTPException, Header, status
from pydantic import BaseModel
from functools import lru_cache


SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")


class AuthUser(BaseModel):
    id: str
    email: str | None = None
    full_name: str | None = None
    jwt: str  # durchgereicht für nachfolgende Supabase-Calls (RLS)


@lru_cache(maxsize=512)
def _verify_jwt_cached(token: str) -> dict | None:
    """Verifiziert JWT gegen Supabase. Klein-cachen, weil ein Frontend in einer
    Page-View denselben Token mehrfach zum Backend schickt.
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return None
    try:
        r = httpx.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_ANON_KEY,
            },
            timeout=5.0,
        )
        if r.status_code == 200:
            return r.json()
        return None
    except Exception:
        return None


async def get_current_user(authorization: str | None = Header(default=None)) -> AuthUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization-Header fehlt (Bearer <token>)",
        )
    token = authorization.split(" ", 1)[1]
    user = _verify_jwt_cached(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token ungültig oder Supabase nicht erreichbar")
    meta = user.get("user_metadata") or {}
    return AuthUser(
        id=user["id"],
        email=user.get("email"),
        full_name=meta.get("full_name"),
        jwt=token,
    )


CurrentUser = Depends(get_current_user)
