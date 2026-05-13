"""AI-Adoption-Studio · FastAPI-Backend.

Lokal starten:
    uvicorn api.main:app --reload --port 8000

Erwartet ENV (siehe .env.example):
    ANTHROPIC_API_KEY
    ELEVENLABS_API_KEY
    SUPABASE_URL
    SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    SUPABASE_JWT_SECRET
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from api.routers import onboarding, upload, voice, run, research, webhooks

app = FastAPI(
    title="AI-Adoption-Studio API",
    version="0.1.0",
    description="Multi-Agent-System für KI-Adoptions-Beratung im Mittelstand (Hospitality MVP).",
)

# CORS — Frontend läuft local auf 3000, Vercel-Domain später
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_url := os.getenv("FRONTEND_URL"):
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root():
    return {
        "service": "ai-adoption-studio",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
def health():
    """Light health-check — KEIN externer Service-Roundtrip."""
    return {"status": "ok"}


# Router-Mounting
app.include_router(onboarding.router)
app.include_router(upload.router)
app.include_router(voice.router)
app.include_router(research.router)
app.include_router(run.router)
app.include_router(webhooks.router)
