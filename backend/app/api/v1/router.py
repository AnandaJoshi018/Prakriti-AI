"""Versioned API router aggregation."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, health, predictions, reports, uploads

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
