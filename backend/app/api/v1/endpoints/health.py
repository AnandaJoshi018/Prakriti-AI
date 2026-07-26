"""Health and readiness endpoints."""

from fastapi import APIRouter

from app.core.config import get_settings
from app.ml.inference import get_model_manager

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get("/health")
async def health_check() -> dict:
    return {"status": "ok", "service": settings.app_name, "version": settings.app_version}


@router.get("/ready")
async def readiness_check() -> dict:
    manager = get_model_manager()
    return {
        "status": "ready" if manager.is_loaded else "degraded",
        "model_loaded": manager.is_loaded,
    }
