"""Shared FastAPI-Dependencies (Supabase-Client mit User-JWT)."""
from supabase import Client
from agents._supabase import get_client
from api.auth import AuthUser


def supabase_for(user: AuthUser) -> Client:
    """Supabase-Client für einen authentifizierten User. RLS greift automatisch."""
    return get_client(user_jwt=user.jwt)
